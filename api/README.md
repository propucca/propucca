# Blogger Api service ##

## To create new project

    nest new <project name>

## product structure

    Every service should be modularized 

    Example :-

            user 
                > user-controller
                    user-controller.controller.ts // return service and mention methods
                    user-controller.module.ts // import everything inside module
                    user-controller.service.ts // write logics
                    > dto
                        user-controller.dto.ts // write validators

            address 
                > address-controller
                    address-controller.controller.ts
                    address-controller.module.ts
                    address-controller.service.ts
                    > dto
                        address-controller.dto.ts



## To run app

    npm run start

## To create new module

    nest g module <module name>


## To run build project

    npm run build
    node dist/main.js



## To create new

    module       --> nest g module <name>
    controller   --> nest g controller <name>
    service      --> nest g service <name> 

    To create all at once user nest g resource <name>

## linting 

    npm init @eslint/config@latest // configure lint

## husky

    npx husky-init && npm install


## to run test

    npm run test:e2e

    keep testing files under 

        test > **-spec.ts


## docker 

### to build image

    docker build -t blogger-api:latest .

### to run locally

    docker run -p 8000:8000 blogger-api:latest

### to push the image to AWS ECR

#### to login to ECR
    sudo aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-south-1.amazonaws.com

#### to tag image
    sudo docker tag <docker-image-id> <account-id>.dkr.ecr.ap-south-1.amazonaws.com/<image-name>:<tag>

#### to push to ECR
    sudo docker push <account-id>.dkr.ecr.ap-south-1.amazonaws.com/<image-name>:<tag>

