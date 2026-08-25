alert("admin-form.js berhasil dimuat");

const FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSdMh9DFjTuAmRk4ECEqKYMV0vFKPNYsgSUl2j3W32HJzqMDWA/formResponse";

const form = document.getElementById("konsekuensiForm");
const statusText = document.getElementById("status");

form.addEventListener("submit", function (event) {

    event.preventDefault();

    // Buat iframe tersembunyi
    const iframe = document.createElement("iframe");

    iframe.name = "konsekuensiGoogleFormFrame";
    iframe.style.display = "none";

    document.body.appendChild(iframe);


    // Buat form pengiriman tersembunyi
    const googleForm = document.createElement("form");

    googleForm.method = "POST";
    googleForm.action = FORM_URL;
    googleForm.target = "konsekuensiGoogleFormFrame";


    // Fungsi menambahkan data
    function addField(name, value) {

        const input = document.createElement("input");

        input.type = "hidden";
        input.name = name;
        input.value = value;

        googleForm.appendChild(input);
    }


    // ABSEN
    addField(
        "entry.698979165",
        document.getElementById("absen").value
    );


    // KODE
    addField(
        "entry.808717514",
        document.getElementById("kode").value
    );


    // CATATAN
    addField(
        "entry.879564375",
        document.getElementById("catatan").value
    );


    document.body.appendChild(googleForm);

    statusText.textContent =
        "⏳ Menyimpan...";


    // Kirim ke Google Forms
    googleForm.submit();


    // Beri waktu Google Forms menerima data
    setTimeout(() => {

        statusText.textContent =
            "✅ Pencatatan berhasil disimpan.";

        form.reset();

        googleForm.remove();
        iframe.remove();

    }, 1500);

});