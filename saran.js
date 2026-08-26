const FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLScFEu0EaD8Dmlq4KKWWEUhwpHLZBcKQ-nXxN1oiAL5yrZv0aQ/formResponse";


const form =
    document.getElementById("saranForm");

const statusText =
    document.getElementById("status");

const anonim =
    document.getElementById("anonim");

const namaGroup =
    document.getElementById("namaGroup");

const nama =
    document.getElementById("nama");


/* =========================
   TAMPILKAN NAMA
========================= */

anonim.addEventListener("change", function () {

    if (this.value === "Tidak") {

        namaGroup.style.display = "block";

        nama.required = true;

    } else {

        namaGroup.style.display = "none";

        nama.required = false;

        nama.value = "";

    }

});


/* =========================
   KIRIM FORM
========================= */

form.addEventListener("submit", function (event) {

    event.preventDefault();


    const iframe =
        document.createElement("iframe");

    iframe.name =
        "saranGoogleForm";

    iframe.style.display =
        "none";

    document.body.appendChild(iframe);


    const googleForm =
        document.createElement("form");

    googleForm.method =
        "POST";

    googleForm.action =
        FORM_URL;

    googleForm.target =
        "saranGoogleForm";


    function addField(name, value) {

        const input =
            document.createElement("input");

        input.type =
            "hidden";

        input.name =
            name;

        input.value =
            value;

        googleForm.appendChild(input);

    }


    /* JENIS */

    addField(
        "entry.1647289883",
        document.getElementById("jenis").value
    );


    /* ISI */

    addField(
        "entry.1455790611",
        document.getElementById("isi").value
    );


    /* INGIN ANONIM */

    addField(
        "entry.900628768",
        document.getElementById("anonim").value
    );


    /* NAMA */

    addField(
        "entry.1812429661",
        document.getElementById("nama").value
    );


    document.body.appendChild(googleForm);


    statusText.textContent =
        "⏳ Mengirim...";


    googleForm.submit();


    setTimeout(function () {

        statusText.textContent =
            "✅ Terima kasih, tanggapan berhasil dikirim.";

        form.reset();

        namaGroup.style.display =
            "none";

        nama.required =
            false;

        googleForm.remove();

        iframe.remove();

    }, 1500);

});