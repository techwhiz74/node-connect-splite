var showCommentModal;
function showImage() {
     axios.get("http://localhost:3000/get").then((res) => {
       res.data.data.forEach((item) => {
         var imgElement = document.getElementById("img");
         var divp = document.createElement('div')
         divp.classList.add("grid-item");
         var divE = document.createElement('div')
         divE.style.textAlign = "center";
         var img = document.createElement("img");
         img.setAttribute("id", item.id);
         img.setAttribute("data-comment", item.comment);
         img.src = `data:image/png;base64,${item.value}`;
         img.style.width = "25vw";
         img.style.cursor = "pointer";
         divp.appendChild(img);
         divp.appendChild(divE);
         imgElement.appendChild(divp);
        
         img.addEventListener("click", function (e) {
           var comment = e.target.getAttribute("data-comment");
           var commentModal = e.target.nextElementSibling;
          //  imgElement.appendChild(commentModal);
          //  commentModal.style.display = "block";
          //  var element = document.createElement("div");
          commentModal.innerHTML = comment?comment:'';
          //  commentModal.appendChild(element);
         });
       });
     }).catch(error => {
       console.error("Error fetching data:", error);
     });
   }

document.getElementById("uploadForm").onsubmit = async function (event) {
  event.preventDefault();

  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  const comment = document.getElementById("comment").value;

  if (!file) {
    alert("Please select a file to upload");
    return;
  }

  const formData = new FormData();
  formData.append("comment", comment);
  formData.append("file", file);

  console.log(file, "---");

  try {
    const response = await axios.post("http://localhost:3000/save", formData);
    alert("File uploaded successfully");
  } catch (error) {
    console.error("Error uploading file:", error);
    alert("An error occurred while uploading the file");
  }
};
