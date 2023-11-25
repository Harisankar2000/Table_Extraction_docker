# Use the official AWS Lambda Node.jsruntime as the base image
FROM public.ecr.aws/lambda/nodejs:18

# Set the working directory to ${LAMBDA_TASK_ROOT}
WORKDIR ${LAMBDA_TASK_ROOT}

# Copy package.json  to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire contents of the current directory to the working directory
COPY . .

# CMD specifies the command to run when the Lambda function starts
CMD [ "handler.handler" ]