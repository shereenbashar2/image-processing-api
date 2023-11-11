document.addEventListener("DOMContentLoaded", () => {
    const imageUploadForm = document.getElementById("imageUploadForm");
    const imageInput = document.getElementById("imageInput");
    const uploadButton = document.getElementById("uploadButton");
    const status = document.getElementById("status");
    const resizedImageContainer = document.getElementById("resizedImageContainer");
    const qualityInput = document.getElementById("quality");
    const widthInput = document.getElementById("width");
    const heightInput = document.getElementById("height");

    const displayThumbnailImages = async () => {
        try {
            const response = await fetch("/api/images/thumbnails");
            if (!response.ok) {
                throw new Error(`Failed to fetch thumbnail images. Status: ${response.status}`);
            }

            const thumbnailImages = await response.json();

            resizedImageContainer.innerHTML = "";

            thumbnailImages.forEach((thumbnailImage) => {
                const { url, filename } = thumbnailImage;
                const imgElement = document.createElement("img");
                imgElement.src = url;
                imgElement.alt = filename;
                resizedImageContainer.appendChild(imgElement);
            });
        } catch (error) {
            console.error("Error fetching and displaying thumbnail images:", error.message);
            // Display the error message in the UI
            status.innerHTML = `Error: ${error.message}`;
        }
    };

    const handleUploadButtonClick = async () => {
        try {
            const formData = new FormData();
            formData.append("file", imageInput.files[0]);

            const response = await fetch("/api/images/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Failed to upload image. Status: ${response.status}`);
            }

            const { message, file } = await response.json();

            status.innerHTML = message;

            const { filename, extension } = extractFilenameAndExtension(file.filename);
            const quality = qualityInput.value || 80;
            const width = widthInput.value || 300;
            const height = heightInput.value || 300;

            console.log("Original Image Filename:", filename);
            console.log("Image Extension:", extension);

            const processImageResponse = await fetch(`/api/images/process-image?imageName=${filename}&format=${extension}&quality=${quality}&width=${width}&height=${height}`, {
                method: "GET",
            });

            if (!processImageResponse.ok) {
                throw new Error(`Failed to process image. Status: ${processImageResponse.status}`);
            }

            displayThumbnailImages();
        } catch (error) {
            console.error("Error handling image upload:", error.message);
            // Display the error message in the UI
            status.innerHTML = `Error: ${error.message}`;
        }
    };

    const extractFilenameAndExtension = (filenameWithExtension) => {
        const [filename, extension] = filenameWithExtension.split('.');
        return { filename, extension };
    };

    uploadButton.addEventListener("click", handleUploadButtonClick);

    // Display thumbnail images when the page loads
    displayThumbnailImages();
});
