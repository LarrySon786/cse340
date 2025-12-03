const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
      const updateSubmit = document.getElementById("#submitButton")
      updateSubmit.removeAttribute("disabled")
    })