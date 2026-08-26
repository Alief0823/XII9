const FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSck2ZBupBTlIFJmGok0vW6FhVy7M4PHPg7lyTPCaZyMNgwLxQ/formResponse";

const form = document.getElementById("laporanForm");
const statusText = document.getElementById("status");

// Isi tanggal hari ini secara otomatis
const tanggalInput = document.getElementById("tanggal");

function setTanggalHariIni() {
    const now = new Date();

    const tahun = now.getFullYear();
    const bulan = String(now.getMonth() + 1).padStart(2, "0");
    const hari = String(now.getDate()).padStart(2, "0");

    tanggalInput.value = `${tahun}-${bulan}-${hari}`;
}

setTanggalHariIni();

form.addEventListener("submit", function (event) {

    event.preventDefault();

    // Buat iframe tersembunyi
    const iframe = document.createElement("iframe");

    iframe.name = "googleFormFrame";
    iframe.style.display = "none";

    document.body.appendChild(iframe);

    // Buat form pengiriman tersembunyi
    const googleForm = document.createElement("form");

    googleForm.method = "POST";
    googleForm.action = FORM_URL;
    googleForm.target = "googleFormFrame";

    // Tambahkan data
    function addField(name, value) {

        const input = document.createElement("input");

        input.type = "hidden";
        input.name = name;
        input.value = value;

        googleForm.appendChild(input);
    }

    addField(
        "entry.1394896671",
        document.getElementById("nama").value
    );

    addField(
        "entry.1205818588",
        document.getElementById("bidang").value
    );

    addField(
        "entry.339071146",
        document.getElementById("tanggal").value
    );

    addField(
        "entry.237098355",
        document.getElementById("laporan").value
    );

    addField(
        "entry.1166212307",
        document.getElementById("kendala").value
    );

    document.body.appendChild(googleForm);

    statusText.textContent = "⏳ Mengirim laporan...";

    googleForm.submit();

    // Beri waktu Google Forms menerima data
    setTimeout(() => {

        statusText.textContent =
            "✅ Laporan berhasil dikirim.";

        form.reset();

        setTanggalHariIni();

        googleForm.remove();
        iframe.remove();

    }, 1500);

});