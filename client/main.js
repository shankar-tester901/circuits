function triggerCircuit() {
    $.ajax({
        url: "/server/render_resized_images_function/triggerCircuit",
        type: "post",
        success: function (data) {
            document.getElementById('status').innerHTML = "Image Moderation Initiated";
        },
        error: function (error) {
            console.log(error);
            alert('Internal Server Error');
        }
    })
}

function getImages() {

    document.getElementById('right_part').style.visibility = "visible";
    document.getElementById('left_part').style.visibility = "visible";
    document.getElementById('status').innerHTML = "";
    $.ajax({
        url: "/server/render_resized_images_function/getImageIds",
        type: "get",
        success: function (data) {
            document.getElementById('message').innerHTML = "";
            if (data.Images.length != 0 && data.ResizedImages.length != 0) {
                document.getElementById('sample').src = "/baas/v1/project/3296000000550149/folder/3296000000550192/file/" + data.Images[0] + "/download?Environment=Development";
                document.getElementById('sample').style.width="100%"
                var actualImages = document.getElementById('actualImages');
                for (var i = 1; i < data.Images.length; i++) {
                    if (data.Images[i]) {
                        var imageContainer = document.createElement('div');
                        imageContainer.setAttribute("class", "mySlides fade");
                        imageContainer.style.display = 'none';
                        var image = document.createElement('img');
                        image.src = "/baas/v1/project/3296000000550149/folder/3296000000550192/file/" + data.Images[i] + "/download?Environment=Development";
                        image.style.width = "100%";
                        imageContainer.appendChild(image);
                        actualImages.appendChild(imageContainer);
                    }
                }
                var a = document.createElement('a');
                a.className = "prev";
                a.href = "javascript:plusSlides(-1)";
                a.innerHTML = "&#10094;";
                actualImages.appendChild(a);
                var a = document.createElement('a');
                a.className = "next";
                a.href = "javascript:plusSlides(1)";
                a.innerHTML = "&#10095;";
                actualImages.appendChild(a);

                document.getElementById('samplez').src = "/baas/v1/project/3296000000550149/folder/3296000000588147/file/" + data.ResizedImages[0] + "/download?Environment=Development";
                document.getElementById('sample').style.width="100%"
                var resizedImages = document.getElementById('resizedImages');
                for (var i = 1; i < data.ResizedImages.length; i++) {
                    if (data.ResizedImages[i]) {
                        var imageContainer = document.createElement('div');
                        imageContainer.setAttribute("class", "mySlidez fade");
                        imageContainer.style.display = 'none';
                        var image = document.createElement('img');
                        image.src = "/baas/v1/project/3296000000550149/folder/3296000000588147/file/" + data.ResizedImages[i] + "/download?Environment=Development";
                        imageContainer.appendChild(image);
                        resizedImages.appendChild(imageContainer);
                    }
                }
                var a = document.createElement('a');
                a.className = "prev";
                a.href = "javascript:plusSlidez(-1)";
                a.innerHTML = "&#10094;";
                resizedImages.appendChild(a);
                var a = document.createElement('a');
                a.className = "next";
                a.href = "javascript:plusSlidez(1)";
                a.innerHTML = "&#10095;";
                resizedImages.appendChild(a);
            } else {
                document.getElementById('right_part').style.visibility = "hidden";
                document.getElementById('left_part').style.visibility = "hidden";
                document.getElementById('message').innerHTML = "Image Moderation still in Process. Please try again after sometime."
            }
        },
        error: function (error) {
            console.log(error);
            alert('Internal Server Error');
        }
    })
}