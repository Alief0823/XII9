const urlPeraturan =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJifuHKVd_PkTO6pcOPU-ZShZEYzm81Nz-J-ul3QLkqzgEp3-61YMtMXCkZfjiIxQ8zHUAmW2UGBJR/pub?gid=1644548022&single=true&output=csv";


const container =
    document.getElementById("daftar-peraturan");


/* =========================
   PARSE CSV
========================= */

function parseCSV(text) {

    const rows = [];

    let row = [];
    let cell = "";

    let insideQuotes = false;


    for (let i = 0; i < text.length; i++) {

        const char = text[i];
        const next = text[i + 1];


        /* Kutip ganda di dalam data */

        if (
            char === '"' &&
            insideQuotes &&
            next === '"'
        ) {

            cell += '"';

            i++;

        }


        /* Awal / akhir kutip */

        else if (char === '"') {

            insideQuotes =
                !insideQuotes;

        }


        /* Pemisah kolom */

        else if (
            char === "," &&
            !insideQuotes
        ) {

            row.push(cell);

            cell = "";

        }


        /* Pemisah baris */

        else if (
            (char === "\n" ||
             char === "\r") &&
            !insideQuotes
        ) {

            if (
                char === "\r" &&
                next === "\n"
            ) {

                i++;

            }


            row.push(cell);

            rows.push(row);


            row = [];

            cell = "";

        }


        /* Karakter biasa */

        else {

            cell += char;

        }

    }


    /* Data terakhir */

    if (
        cell !== "" ||
        row.length > 0
    ) {

        row.push(cell);

        rows.push(row);

    }


    return rows;

}


/* =========================
   MEMBERSIHKAN TEKS
========================= */

function bersihkanTeks(teks) {

    return String(teks || "")
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .trim();

}


/* =========================
   MEMBUAT ISI PERATURAN
========================= */

function buatIsiPeraturan(isi) {

    const content =
        document.createElement("div");


    content.className =
        "rule-content";


    const teks =
        bersihkanTeks(isi);


    /*
     * Pisahkan berdasarkan
     * baris baru dari Spreadsheet.
     */

    const baris =
        teks.split("\n");


    baris.forEach(barisTeks => {

        const teksBaris =
            barisTeks.trim();


        /* Lewati baris kosong */

        if (!teksBaris) {

            return;

        }


        const p =
            document.createElement("p");


        /*
         * textContent digunakan agar
         * isi Spreadsheet tidak dianggap
         * sebagai kode HTML.
         */

        p.textContent =
            teksBaris;


        content.appendChild(p);

    });


    return content;

}


/* =========================
   MEMBUAT KARTU PERATURAN
========================= */

function buatPeraturan(row) {

    /*
     * Struktur Spreadsheet:
     *
     * A = ID
     * B = Judul
     * C = Isi
     * D = Status
     * E = Urutan
     */


    const id =
        row[0] || "";


    const judul =
        bersihkanTeks(row[1]);


    const isi =
        bersihkanTeks(row[2]);


    const status =
        bersihkanTeks(row[3]);


    /* Hanya aktif */

    if (
        status.toLowerCase() !==
        "aktif"
    ) {

        return null;

    }


    if (!judul || !isi) {

        return null;

    }


    /* =========================
       KARTU
    ========================= */

    const rule =
        document.createElement("div");


    rule.className =
        "rule";


    /*
     * Simpan ID jika nanti
     * dibutuhkan untuk identifikasi.
     */

    rule.dataset.id = id;


    /* =========================
       TOMBOL JUDUL
    ========================= */

    const tombol =
        document.createElement("button");


    tombol.type =
        "button";


    tombol.className =
        "rule-title";


    tombol.innerHTML = `
        <span>▶</span>
        <strong></strong>
    `;


    /*
     * Masukkan judul menggunakan
     * textContent agar aman.
     */

    tombol.querySelector("strong")
        .textContent = judul;


    /* =========================
       ISI
    ========================= */

    const isiRule =
        buatIsiPeraturan(isi);


    /* =========================
       BUKA / TUTUP
    ========================= */

    tombol.addEventListener(
        "click",
        function () {

            const terbuka =
                isiRule.classList.toggle(
                    "open"
                );


            const ikon =
                tombol.querySelector(
                    "span"
                );


            if (terbuka) {

                ikon.textContent =
                    "▼";

            }

            else {

                ikon.textContent =
                    "▶";

            }

        }
    );


    /* =========================
       GABUNGKAN
    ========================= */

    rule.appendChild(tombol);

    rule.appendChild(isiRule);


    return rule;

}


/* =========================
   MEMUAT DATA SPREADSHEET
========================= */

if (container) {

    container.innerHTML = `
        <p>Memuat peraturan...</p>
    `;


    fetch(urlPeraturan)


        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Spreadsheet gagal dimuat."
                );

            }


            return response.text();

        })


        .then(csv => {

            const data =
                parseCSV(csv);


            /* Hapus header */

            data.shift();


            /* =========================
               URUTKAN BERDASARKAN
               KOLOM E = URUTAN
            ========================= */

            data.sort((a, b) => {

                const urutanA =
                    Number(a[4]) || 999999;


                const urutanB =
                    Number(b[4]) || 999999;


                return urutanA -
                       urutanB;

            });


            /* Bersihkan container */

            container.innerHTML = "";


            let jumlah =
                0;


            /* =========================
               TAMPILKAN DATA
            ========================= */

            data.forEach(row => {

                const peraturan =
                    buatPeraturan(row);


                if (!peraturan) {

                    return;

                }


                jumlah++;


                container.appendChild(
                    peraturan
                );

            });


            /* =========================
               JIKA KOSONG
            ========================= */

            if (jumlah === 0) {

                container.innerHTML = `
                    <p>
                        Belum ada peraturan
                        yang aktif.
                    </p>
                `;

            }

        })


        .catch(error => {

            console.error(
                "ERROR PERATURAN:",
                error
            );


            container.innerHTML = `
                <p>
                    ⚠️ Gagal memuat
                    peraturan.
                </p>
            `;

        });

}