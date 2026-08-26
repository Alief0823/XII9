const FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSdMh9DFjTuAmRk4ECEqKYMV0vFKPNYsgSUl2j3W32HJzqMDWA/formResponse";

const form = document.getElementById("absenForm");
const statusText = document.getElementById("status");


form.addEventListener("submit", function (event) {

    event.preventDefault();

    const iframe = document.createElement("iframe");

    iframe.name = "absenGoogleFormFrame";
    iframe.style.display = "none";

    document.body.appendChild(iframe);


    const googleForm = document.createElement("form");

    googleForm.method = "POST";

    googleForm.action = FORM_URL;

    googleForm.target = "absenGoogleFormFrame";


    function addField(name, value) {

        const input =
            document.createElement("input");

        input.type = "hidden";

        input.name = name;

        input.value = value;

        googleForm.appendChild(input);
    }


    addField(
        "entry.698979165",
        document.getElementById("nama").value
    );


    addField(
        "entry.808717514",
        document.getElementById("kode").value
    );


    addField(
        "entry.879564375",
        document.getElementById("keterangan").value
    );


    document.body.appendChild(googleForm);


    statusText.textContent =
        "⏳ Menyimpan...";


    googleForm.submit();


    setTimeout(() => {

        statusText.textContent =
            "✅ Absen berhasil disimpan.";

        form.reset();

        googleForm.remove();

        iframe.remove();

    }, 1500);

});