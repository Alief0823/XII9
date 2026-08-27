alert("admin-form.js berhasil dimuat");

const FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSdMh9DFjTuAmRk4ECEqKYMV0vFKPNYsgSUl2j3W32HJzqMDWA/formResponse";

const form = document.getElementById("konsekuensiForm");
const statusText = document.getElementById("status");


// ================================
// CEK ELEMEN
// ================================

if (!form) {
    console.error("ERROR: #konsekuensiForm tidak ditemukan.");
}

if (!statusText) {
    console.error("ERROR: #status tidak ditemukan.");
}


// ================================
// SUBMIT FORM
// ================================

if (form) {

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        // Cegah submit ganda
        if (form.dataset.sending === "true") {
            console.warn("Pengiriman masih berlangsung.");
            return;
        }

        form.dataset.sending = "true";


        // ================================
        // AMBIL DATA TERLEBIH DAHULU
        // ================================

        const absen =
            document.getElementById("absen").value.trim();

        const kode =
            document.getElementById("kode").value.trim();

        const catatan =
            document.getElementById("catatan").value.trim();


        console.log("================================");
        console.log("DATA YANG AKAN DIKIRIM");
        console.log("Absen   :", absen);
        console.log("Kode    :", kode);
        console.log("Catatan :", catatan);
        console.log("================================");


        // ================================
        // VALIDASI
        // ================================

        if (!absen || !kode || !catatan) {

            statusText.textContent =
                "⚠️ Semua data harus diisi.";

            form.dataset.sending = "false";

            return;
        }


        // ================================
        // BUAT NAMA IFRAME UNIK
        // ================================

        const frameName =
            "googleFormFrame_" + Date.now();


        const iframe =
            document.createElement("iframe");

        iframe.name = frameName;
        iframe.id = frameName;

        iframe.style.position = "absolute";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "0";
        iframe.style.visibility = "hidden";

        document.body.appendChild(iframe);


        // ================================
        // BUAT FORM GOOGLE
        // ================================

        const googleForm =
            document.createElement("form");

        googleForm.method = "POST";
        googleForm.action = FORM_URL;
        googleForm.target = frameName;

        googleForm.style.display = "none";


        // ================================
        // FUNGSI FIELD
        // ================================

        function addField(name, value) {

            const input =
                document.createElement("input");

            input.type = "hidden";
            input.name = name;
            input.value = value;

            googleForm.appendChild(input);
        }


        // ================================
        // MASUKKAN DATA
        // ================================

        addField(
            "entry.698979165",
            absen
        );

        addField(
            "entry.808717514",
            kode
        );

        addField(
            "entry.879564375",
            catatan
        );


        // ================================
        // PASANG FORM KE HALAMAN
        // ================================

        document.body.appendChild(googleForm);


        statusText.textContent =
            "⏳ Menyimpan data...";


        console.log("Mengirim POST ke Google Forms...");
        console.log("URL:", FORM_URL);
        console.log("Target iframe:", frameName);


        // ================================
        // SUBMIT
        // ================================

        try {

            googleForm.submit();

            console.log(
                "POST Google Forms berhasil dipanggil."
            );

        } catch (error) {

            console.error(
                "Gagal melakukan submit:",
                error
            );

            statusText.textContent =
                "❌ Gagal mengirim data.";

            form.dataset.sending = "false";

            googleForm.remove();
            iframe.remove();

            return;
        }


        // ================================
        // SELESAI
        // ================================

        setTimeout(function () {

            statusText.textContent =
                "✅ Data berhasil dikirim.";

            form.reset();

            form.dataset.sending = "false";


            // Bersihkan elemen sementara
            setTimeout(function () {

                googleForm.remove();
                iframe.remove();

            }, 500);


            console.log(
                "Proses pengiriman selesai."
            );

        }, 2000);

    });

}
