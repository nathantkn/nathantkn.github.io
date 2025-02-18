const storageKey = "stitchCounter";
const storedData = localStorage.getItem(storageKey) || "[]";
const sectionData = JSON.parse(storedData);

let activeSection = sectionData[0];
rerender();

function findSection(name) {
  return sectionData.find(s => s.name === name);
}

function updateLocalStorage() {
  localStorage.setItem(storageKey, JSON.stringify(sectionData));
}

function addRow() {
  if (activeSection.stitchCount === 0) {
    window.alert("No stitches in row");
    return;
  }
  const newRowCount = activeSection.rowCount + 1;
  activeSection.history.push({
    rowCount: newRowCount,
    stitchCount: activeSection.stitchCount
  });
  activeSection.rowCount = newRowCount;
  activeSection.stitchCount = 0;
  updateLocalStorage();
  rerender();
}

function subtractRow() {
  const newRowCount = activeSection.rowCount - 1;
  if (newRowCount < 0) return;
  activeSection.history.pop();

  activeSection.rowCount = newRowCount;
  updateLocalStorage();
  rerender();
}

function updateStitch(amount) {
  const newStitchCount = activeSection.stitchCount + amount;
  if (newStitchCount < 0) return;
  activeSection.stitchCount = newStitchCount;
  updateLocalStorage();
  rerender();
}

function deleteSection() {
  const areYouSure = `Are you sure you want to delete section ${activeSection.name
    }?`;
  if (!confirm(areYouSure)) return;

  const index = sectionData.findIndex(s => s.name === activeSection.name);
  sectionData.splice(index, 1);
  activeSection = sectionData[0];
  updateLocalStorage();
  rerender();
}

$("#newSectionForm").submit(function (e) {
  const sectionName = $("#sectionName").val();
  if (!sectionName) {
    window.alert("Please enter a section name");
    return;
  }
  if (findSection(sectionName)) {
    window.alert("Please enter a unique section name");
    return false;
  }

  const newSection = {
    name: sectionName,
    rowCount: 0,
    stitchCount: 0,
    history: []
  };
  sectionData.push(newSection);
  activeSection = newSection;
  updateLocalStorage();
  rerender();

  $("#sectionName").val("");
  return false;
});

$(document).on("click", ".section-name", function () {
  const rowInd = $(this).attr("data-ind");
  const section = sectionData[rowInd];
  activeSection = section;
  rerender();
});

function renderActiveSection() {
  if (!activeSection) {
    return;
  }

  $("#activeSectionName").text(activeSection.name);
  $("#rowCount").text(activeSection.rowCount);
  $("#stitchCount").text(activeSection.stitchCount);
}

function formatHistory(history) {
  return history
    .map(entry => {
      return `Row ${entry.rowCount}: ${entry.stitchCount} stitches `;
    })
    .join("<br>");
}

function renderSectionTableRow(section, ind) {
  const nameCol = `
    <td class="section-name" data-ind=${ind}>
      <span class="section-name-button">
        ${section.name}
      </span>
    </td>
  `;

  const historyCol = `
    <td>
      ${formatHistory(section.history)}
    </td>
  `;

  const columns = nameCol + historyCol;
  return `<tr>${columns}</tr>`;
}

function renderSectionTable() {
  if (sectionData.length === 0) {
    $("#activeSection").hide();
    $(".overview-section").hide();
    return;
  }
  $("#activeSection").show();
  $(".overview-section").show();
  const tableRows = sectionData
    .map((section, ind) => {
      return renderSectionTableRow(section, ind);
    })
    .join();
  $("#sectionTable")
    .find("tbody")
    .html(tableRows);
}

function rerender() {
  renderActiveSection();
  renderSectionTable();
}