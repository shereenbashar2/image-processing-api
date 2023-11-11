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
            const thumbnailImages = await response.json();

            resizedImageContainer.innerHTML = "";

            thumbnailImages.forEach((thumbnailImage) => {
                const imgElement = document.createElement("img");
                imgElement.src = thumbnailImage.url;
                imgElement.alt = thumbnailImage.filename;
                resizedImageContainer.appendChild(imgElement);
            });
        } catch (error) {
            console.error("Error fetching and displaying thumbnail images:", error.message);
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

            const data = await response.json();

            status.innerHTML = data.message;

            const { filename, extension } = extractFilenameAndExtension(data.file.filename);
            const quality = qualityInput.value || 80;
            const width = widthInput.value || 300;
            const height = heightInput.value || 300;

            console.log("Original Image Filename:", filename);
            console.log("Image Extension:", extension);

            await fetch(`/api/images/process-image?imageName=${filename}&format=${extension}&quality=${quality}&width=${width}&height=${height}`, {
                method: "GET",
            });

            displayThumbnailImages();
        } catch (error) {
            status.innerHTML = "Error: " + error.message;
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
