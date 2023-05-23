document.addEventListener("DOMContentLoaded", () => {
    const urlInput = document.getElementById("url-input");
    const resultContainer = document.getElementById("result-container");
    const loader = document.getElementById("loader");

    if (
        !urlInput ||
        !resultContainer ||
        !loader
    ) {
        console.error("Target element not found.");
        return;
    }

    document
        .getElementById("extract-form")
        .addEventListener("submit", async (event) => {
            event.preventDefault();

            resultContainer.style.display = "none";
            loader.style.display = "block";

            const response = await fetch("/extract", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `url=${encodeURIComponent(urlInput.value.trim())}`,
            });

            loader.style.display = "none";

            if (response.ok) {
                const data = await response.text();

                resultContainer.innerHTML = data;
                resultContainer.style.display = "block";
            } else {
                alert(
                    "Error occurred while extracting text. Please try again."
                );
            }
        });
});
