const { PDFNet } = require('@pdftron/pdfnet-node');
const PDFTronLicense = require('./LicenseKey.json');

async function runDataExtraction(inputPath) {
    console.log("INSIDE runDataExtraction FUNCTION::");
    try {
        await PDFNet.initialize(PDFTronLicense.Key);

        if (!await PDFNet.DataExtractionModule.isModuleAvailable(PDFNet.DataExtractionModule.DataExtractionEngine.e_DocStructure)) {
            throw new Error('Apryse SDK Tabular Data module not available.');
        } else {
            const pdfString = await PDFNet.DataExtractionModule.extractDataAsString(inputPath, PDFNet.DataExtractionModule.DataExtractionEngine.e_DocStructure);
            const pdfJson = JSON.parse(pdfString);

            const extractedData = await extractTableData(pdfJson);
            console.log(JSON.stringify(extractedData, null, 2));

            return extractedData;
        }
    } catch (err) {
        console.error(err);
    } finally {
        console.log('Done.');
        await PDFNet.shutdown();
    }
};

async function extractTableData(pdfJson) {
    console.log("INSIDE extractTableData FUNCTION::");
    const result = [];

    try {
        for (let i = 0; i < pdfJson.pages.length; i++) {
            const pageData = pdfJson.pages[i].elements;
            const tables = pageData.filter(element => element.type === 'table');
            const tableTitleElements = pageData.filter(element => element.type === 'heading');

            for (let j = 0; j < tables.length; j++) {
                const table = tables[j];
                const tableTitle = tableTitleElements[j] ? tableTitleElements[j].contents.map(content => content.text).join(' ') : `Untitled Table on Page ${i + 1}`;

                const tableData = {
                    page: i + 1,
                    table_title: tableTitle,
                    table_coords: table.rect,
                    table_data: await initializeTableData(table.trs.length, table.trs[0].tds.length),
                };

                for (let rowIndex = 0; rowIndex < table.trs.length; rowIndex++) {
                    await Promise.all(table.trs[rowIndex].tds.map(async (td, colIndex) => {
                        try {
                            const cellData = await Promise.all(td.contents.map(content => extractContentWithStyle(content)));
                
                            if (cellData.length > 0) {
                                tableData.table_data[rowIndex][colIndex] = {
                                    text: cellData.map(c => c.text.trim()).join(' '),
                                    rect: td.rect,
                                    font: cellData[0].style.fontFace || 'Times New Roman',
                                    font_size: cellData[0].style.pointSize ? cellData[0].style.pointSize : "",
                                    isBold: cellData[0].style.bold || false,
                                    isItalic: cellData[0].style.italic || false,
                                    underline: cellData[0].style.underline || false,
                                };
                            }
                        } catch (cellError) {
                            console.error('Error processing cell data:', cellError);
                        }
                    }));
                }
                result.push(tableData);
            }
        }
    } catch (error) {
        console.error('Error extracting table data:', error);
    }

    return result;
}

async function extractContentWithStyle(content) {
    try {
        if (content.contents) {
            return {
                type: content.type,
                text: content.contents.map(subContent => subContent.text).join(' '),
                style: content.contents.map(subContent => subContent.style || {}).reduce((acc, style) => ({ ...acc, ...style }), {})
            };
        } else if (content.type === 'paragraph') {
            return {
                type: content.type,
                text: content.text || '',
                style: content.style || {}
            };
        } else {
            return {
                type: content.type,
                text: content.text || '',
                style: content.style || {}
            };
        }
    } catch (error) {
        console.error('Error extracting content with style:', error);
        throw error;
    }
}

async function initializeTableData(rows, cols) {
    const tableData = [];

    try {
        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            const rowData = [];

            for (let colIndex = 0; colIndex < cols; colIndex++) {
                rowData.push(null);
            }

            tableData.push(rowData);
        }
    } catch (error) {
        console.error('Error initializing table data:', error);
        throw error;
    }

    return tableData;
}
module.exports = {
    runDataExtraction,
};