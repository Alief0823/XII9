const JADWAL_CSV =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJifuHKVd_PkTO6pcOPU-ZShZEYzm81Nz-J-ul3QLkqzgEp3-61YMtMXCkZfjiIxQ8zHUAmW2UGBJR/pub?gid=1103446109&single=true&output=csv";

const HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

const BIDANG = [
    "Kebersihan",
    "Kedisiplinan",
    "Keamanan",
    "Keindahan",
    "Keagamaan"
];

function parseCSV(text) {
    const rows = [];
    const lines = text.trim().split(/\r?\n/);

    for (const line of lines) {
        const row = [];
        let cell = "";
        let insideQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                if (insideQuotes && line[i + 1] === '"') {
                    cell += '"';
                    i++;
                } else {
                    insideQuotes = !insideQuotes;
                }
            } else if (char === "," && !insideQuotes) {
                row.push(cell.trim());
                cell = "";
            } else {
                cell += char;
            }
        }

        row.push(cell.trim());
        rows.push(row);
    }

    return rows;
}

async function loadJadwal() {

    try {

        const response = await fetch(JADWAL_CSV);

        if (!response.ok) {
            throw new Error("Gagal mengambil data Jadwal");
        }

        const rows = parseCSV(await response.text());

        /*
         * ==========================
         * 5K
         * ==========================
         *
         * Data 5K berada pada bagian
         * jadwal utama.
         */

        const startRow5K = 3;

        HARI.forEach((hari, hariIndex) => {

            const row = rows[startRow5K + hariIndex];

            if (!row) return;

            BIDANG.forEach((bidang, bidangIndex) => {

                const value = row[bidangIndex + 1] || "-";

                const id =
                    bidang.toLowerCase() +
                    "-" +
                    hari.toLowerCase();

                const cell = document.getElementById(id);

                if (cell) {
                    cell.textContent = value;
                }

            });

        });


        /*
         * ==========================
         * PIKET
         * ==========================
         *
         * B10 = Hari
         * C10 = Anggota Piket
         *
         * Data mulai baris 11.
         */

          
const piketRow = rows[9];

if (piketRow) {

    const hariPiket = piketRow[1] || "Hari Libur";
    const anggotaPiket = piketRow[2] || "-";

    document.getElementById("piket-hari").textContent = hariPiket;

    const anggotaElement = document.getElementById("piket-anggota");

    anggotaElement.innerHTML = "";

    const daftarNama = anggotaPiket
        .split(",")
        .map(nama => nama.trim())
        .filter(nama => nama !== "");

    daftarNama.forEach(nama => {

        const namaElement = document.createElement("div");

        namaElement.textContent = nama;

        anggotaElement.appendChild(namaElement);

    });
}

    } catch (error) {

        console.error("Jadwal:", error);

        document.querySelectorAll(".schedule-table td")
            .forEach(cell => {
                cell.textContent = "Gagal memuat";
            });

    }
}

loadJadwal();