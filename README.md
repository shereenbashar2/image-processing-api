# Image Processing Server

This project is an Image Processing Server that allows users to upload images, process them, and view thumbnail images.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
3. [Scripts](#scripts)
    - [Test](#test)
    - [Start](#start)
    - [Build](#build)
4. [API Endpoints](#api-endpoints)
    - [Upload Image](#upload-image)
    - [Process Image](#process-image)
    - [Get Thumbnail Images](#get-thumbnail-images)
5. [Project Structure](#project-structure)
6. [Built With](#built-with)
7. [Contributing](#contributing)
8. [License](#license)

## Introduction

The Image Processing Server allows users to upload images, process them with custom settings, and view the processed thumbnail images.

## Getting Started

### Prerequisites

- Node.js and npm installed

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/shereenbashar2/image-processing-api.git
cd image-processing-server
npm install

#Scripts
#Test
Run tests using:
npm test


Start
Start the server:
npm start

The server will be running at http://localhost:3000.


Build
Build the project:
npm run build


Test
Test The project
npm run test


API Endpoints

Upload Image
Description: Upload an image for processing.
Method: POST
Path: /api/images/upload

Process Image
Description: Process an uploaded image with custom settings.
Method: GET
Path: /api/images/process-image
Query Parameters:
imageName (string): Name of the image
format (string): Format of the processed image (e.g., jpg, png)
quality (number): Quality of the processed image (0 to 100)
width (number): Width of the processed image
height (number): Height of the processed image

Get Thumbnail Images
Description: Retrieve a list of thumbnail images.
Method: GET
Path: /api/images/thumbnails



