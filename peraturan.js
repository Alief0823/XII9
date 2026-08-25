const urlPeraturan = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJifuHKVd_PkTO6pcOPU-ZShZEYzm81Nz-J-ul3QLkqzgEp3-61YMtMXCkZfjiIxQ8zHUAmW2UGBJR/pub?gid=1644548022&single=true&output=csv";

const container = document.getElementById("daftar-peraturan");

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


fetch(urlPeraturan)

    .then(response => response.text())

    .then(csv => {

        const data = parseCSV(csv);

        data.shift();

        data.sort((a, b) => {
            return Number(a[4]) - Number(b[4]);
        });

        container.innerHTML = "";

        data.forEach(row => {

            const id = row[0];
            const judul = row[1];
            const isi = row[2];
            const status = row[3];

            if (status.trim().toLowerCase() !== "aktif") {
                return;
            }

            const rule = document.createElement("div");

            rule.className = "rule";

            rule.innerHTML = `
    <button class="rule-title">
        <span>▶</span>
        ${judul}
    </button>

    <div class="rule-content">
        <p>${isi}</p>
    </div>
`;
const tombol = rule.querySelector(".rule-title");
const isiRule = rule.querySelector(".rule-content");

tombol.addEventListener("click", () => {

    const terbuka = isiRule.classList.toggle("open");

    tombol.querySelector("span").textContent =
        terbuka ? "▼" : "▶";

});
          
            container.appendChild(rule);

        });

    })

    .catch(error => {

        container.innerHTML = `
            <p>Gagal memuat peraturan.</p>
        `;

        console.error(error);

    });