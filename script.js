const urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJifuHKVd_PkTO6pcOPU-ZShZEYzm81Nz-J-ul3QLkqzgEp3-61YMtMXCkZfjiIxQ8zHUAmW2UGBJR/pub?gid=0&single=true&output=csv";

const container = document.getElementById("daftar-informasi");


function parseCSV(text) {

    const rows = [];
    let row = [];
    let cell = "";
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {

        const char = text[i];
        const next = text[i + 1];

        if (char === '"' && insideQuotes && next === '"') {
            cell += '"';
            i++;
        }

        else if (char === '"') {
            insideQuotes = !insideQuotes;
        }

        else if (char === "," && !insideQuotes) {
            row.push(cell);
            cell = "";
        }

        else if ((char === "\n" || char === "\r") && !insideQuotes) {

            if (char === "\r" && next === "\n") {
                i++;
            }

            row.push(cell);
            rows.push(row);

            row = [];
            cell = "";
        }

        else {
            cell += char;
        }
    }

    if (cell !== "" || row.length > 0) {
        row.push(cell);
        rows.push(row);
    }

    return rows;
}


if (container) {

    container.innerHTML = "";

    fetch(urlCSV)

        .then(response => response.text())

        .then(csv => {

            const data = parseCSV(csv);

            data.shift();

data.sort((a, b) => {

    const [hariA, bulanA, tahunA] = a[5].split("/");
    const [hariB, bulanB, tahunB] = b[5].split("/");

    const tanggalA = new Date(tahunA, bulanA - 1, hariA);
    const tanggalB = new Date(tahunB, bulanB - 1, hariB);

    return tanggalB - tanggalA;

});

          let jumlahInformasiAktif = 0;

data.forEach(row => {

    const id = row[0];
    const judul = row[1];
    const isi = row[2];
    const status = row[3];
    const prioritas = row[4];
    const tanggal = row[5];

    if (status.trim().toLowerCase() !== "aktif") {
        return;
    }

    jumlahInformasiAktif++;

    const artikel =
        document.createElement("article");


    if (
        prioritas.trim().toLowerCase() === "penting"
    ) {

        artikel.innerHTML = `
            <h3>🔴 PENTING</h3>
            <h4>${judul}</h4>
            <p>${isi}</p>
            <small>📅 ${tanggal}</small>
        `;

    }

    else {

        artikel.innerHTML = `
            <h3>📢 ${judul}</h3>
            <p>${isi}</p>
            <small>📅 ${tanggal}</small>
        `;

    }


    container.appendChild(artikel);

});


/* =========================
   TIDAK ADA INFORMASI AKTIF
========================= */

if (jumlahInformasiAktif === 0) {

    container.innerHTML = `
        <div class="no-information">

            <div class="no-information-icon">
                📭
            </div>

            <strong>
                Tidak Ada Informasi Terkini
            </strong>
        

        </div>
    `;

}

        })

        .catch(error => {

            container.innerHTML = `
                <p>Gagal memuat informasi.</p>
            `;

            console.error(error);

        });

}

/* =========================
   PETUGAS 5K HARI INI
   ========================= */

const urlCSV5K =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJifuHKVd_PkTO6pcOPU-ZShZEYzm81Nz-J-ul3QLkqzgEp3-61YMtMXCkZfjiIxQ8zHUAmW2UGBJR/pub?gid=1103446109&single=true&output=csv";


const petugasContainer =
    document.getElementById("petugas-5k");

const hari5K =
    document.getElementById("hari-5k");


function parseCSV5K(text) {

    const rows = [];

    let row = [];
    let cell = "";
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {

        const char = text[i];
        const next = text[i + 1];

        if (
            char === '"' &&
            insideQuotes &&
            next === '"'
        ) {

            cell += '"';
            i++;

        }

        else if (char === '"') {

            insideQuotes = !insideQuotes;

        }

        else if (
            char === "," &&
            !insideQuotes
        ) {

            row.push(cell.trim());
            cell = "";

        }

        else if (
            (char === "\n" || char === "\r") &&
            !insideQuotes
        ) {

            if (
                char === "\r" &&
                next === "\n"
            ) {
                i++;
            }

            row.push(cell.trim());

            if (
                row.some(
                    isi => isi !== ""
                )
            ) {
                rows.push(row);
            }

            row = [];
            cell = "";

        }

        else {

            cell += char;

        }

    }

    if (
        cell !== "" ||
        row.length > 0
    ) {

        row.push(cell.trim());
        rows.push(row);

    }

    return rows;
}


/* =========================
   TAMPILKAN PETUGAS 5K
   ========================= */

function tampilkanPetugas5K() {

    if (
        !petugasContainer ||
        !hari5K
    ) {
        return;
    }


    const namaHari = [

        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu"

    ];


    const hariSekarang =
        namaHari[new Date().getDay()];


    hari5K.textContent =
        hariSekarang;


    /* Hari libur */

    if (
        hariSekarang === "Sabtu" ||
        hariSekarang === "Minggu"
    ) {

        petugasContainer.innerHTML = `

            <div class="piket-libur">

                🏖️ Hari Libur

                <small>
                    Tidak ada petugas 5K.
                </small>

            </div>

        `;

        return;
    }


    fetch(urlCSV5K)

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "CSV gagal dimuat."
                );

            }

            return response.text();

        })


        .then(csv => {

            const data =
                parseCSV5K(csv);


            console.log(
                "JADWAL 5K:",
                data
            );


            if (data.length < 2) {

                throw new Error(
                    "Data jadwal kosong."
                );

            }


            /*
             * Struktur:
             *
             * Hari
             * Kebersihan
             * Kedisiplinan
             * Keamanan
             * Keindahan
             * Keagamaan
             *
             */


            let barisHari = null;


            for (
                let i = 0;
                i < data.length;
                i++
            ) {

                if (
                    String(data[i][0])
                        .trim()
                        .toLowerCase()
                    ===
                    hariSekarang.toLowerCase()
                ) {

                    barisHari = data[i];

                    break;

                }

            }


            if (!barisHari) {

                throw new Error(
                    "Jadwal " +
                    hariSekarang +
                    " tidak ditemukan."
                );

            }


            /*
             * Kolom:
             *
             * 0 = Hari
             * 1 = Kebersihan
             * 2 = Kedisiplinan
             * 3 = Keamanan
             * 4 = Keindahan
             * 5 = Keagamaan
             */


            const bidang = [

                {
                    nama: "Kebersihan",
                    ikon: "🧹",
                    kolom: 1
                },

                {
                    nama: "Kedisiplinan",
                    ikon: "📚",
                    kolom: 2
                },

                {
                    nama: "Keamanan",
                    ikon: "🛡️",
                    kolom: 3
                },

                {
                    nama: "Keindahan",
                    ikon: "✨",
                    kolom: 4
                },

                {
                    nama: "Keagamaan",
                    ikon: "🕌",
                    kolom: 5
                }

            ];


            petugasContainer.innerHTML = "";


            bidang.forEach(item => {

                const nama =
                    barisHari[item.kolom] ||
                    "-";


                const element =
                    document.createElement("div");


                element.className =
                    "petugas-5k-item";


                element.innerHTML = `

                    <span>
                        ${item.ikon}
                    </span>

                    <strong>
                        ${item.nama}
                    </strong>

                    <b>
                        ${nama}
                    </b>

                `;


                petugasContainer.appendChild(
                    element
                );

            });

        })


        .catch(error => {

            console.error(
                "ERROR 5K:",
                error
            );


            petugasContainer.innerHTML = `

                <p>
                    ⚠️ Jadwal 5K tidak dapat dimuat.
                </p>

            `;

        });

}


/* Jalankan */

tampilkanPetugas5K();