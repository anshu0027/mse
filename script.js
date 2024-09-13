document.addEventListener("DOMContentLoaded", () => {
  const folders = document.querySelectorAll(".folder");

  folders.forEach((folder) => {
    const fileList = folder.querySelector(".file-list");
    const files = Array.from(fileList.children);

    // Sort files by type (PDFs, Images, Videos)
    files.sort((a, b) => {
      if (a.classList.contains("pdf")) return -1;
      if (b.classList.contains("pdf")) return 1;
      if (a.classList.contains("image")) return -1;
      if (b.classList.contains("image")) return 1;
      return 0;
    });

    files.forEach((file) => {
      fileList.appendChild(file);
    });

    // Lazy loading for images, videos, and PDFs
    const lazyFiles = folder.querySelectorAll(".file");

    const options = {
      root: null, // Use the viewport as the container
      threshold: 0.1, // Load when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const file = entry.target;

          // Update the href attribute for PDFs and enable link
          if (file.classList.contains("pdf")) {
            file.href = file.dataset.src;
            file.classList.remove("disabled");

            // Handle click event to open PDF in a viewer
            file.addEventListener("click", function (event) {
              event.preventDefault(); // Prevent default behavior for PDFs

              const pdfViewer = document.createElement("iframe");
              pdfViewer.src = file.href;
              pdfViewer.style.width = "100%";
              pdfViewer.style.height = "600px";
              pdfViewer.style.border = "none";

              // Replace the content area with the PDF viewer
              const contentArea = document.querySelector(".content");
              contentArea.innerHTML = ""; // Clear previous content
              contentArea.appendChild(pdfViewer);
            });
          }
          // Update the src attribute for images
          else if (file.classList.contains("image")) {
            file.src = file.dataset.src;
          }
          // Update the src attribute for videos
          else if (file.classList.contains("video")) {
            file.src = file.dataset.src;
          }

          observer.unobserve(file); // Stop observing once loaded
        }
      });
    }, options);

    lazyFiles.forEach((file) => {
      observer.observe(file);
    });
  });
});
