var position = "";

function sortTable() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("playersList");
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("tr");
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 0; i < rows.length - 1; i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[0];
      y = rows[i + 1].getElementsByTagName("TD")[0];
      //check if the two rows should switch place:
      if (Number(x.innerHTML) < Number(y.innerHTML)) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function addPlayer() {
  var player = document.querySelector("#newPlayer");
  var init = player.childNodes[1].value;
  var name = player.childNodes[3].value;
  var hp = player.childNodes[5].value;
  var ac = player.childNodes[7].value;
  var notes = player.childNodes[9].value;

  if (notes == "") {
    notes = "Add notes";
  }

  if (init != "" && name != "") {
    var newPlayer =
      '<tr><td contenteditable="true" oninput="sortTable()">' +
      init +
      '</td><td contenteditable="true">' +
      name +
      '</td><td contenteditable="true">' +
      hp +
      '</td><td contenteditable="true">' +
      ac +
      '</td><td contenteditable="true">' +
      notes +
      '</td><td class="delete-button"> <button class="delete" onclick="deletePlayer(this);"> <i class="fas fa-trash"></i> </button></td></tr>';

    document.querySelector("#playersList").innerHTML += newPlayer;
    sortTable();

    player.childNodes[1].value = "";
    player.childNodes[3].value = "";
    player.childNodes[5].value = "";
    player.childNodes[7].value = "";
    player.childNodes[9].value = "";
  } else {
    document.querySelector(".tooltiptext").style.visibility = "visible";
    document.querySelector(".tooltiptext").style.opacity = "1";
    setTimeout(function () {
      document.querySelector(".tooltiptext").style.visibility = "hidden";
      document.querySelector(".tooltiptext").style.opacity = "0";
    }, 3000);
  }
}

function deletePlayer(player) {
  player.parentNode.parentNode.remove();
  sortTable();
}

function showPlayers() {
  document.querySelector("#block-one").classList.add("unselected");
  document.querySelector("#player-header").classList.remove("hide");
  document.querySelector("#playersList").classList.remove("hide");
  document.querySelector("#new-player").classList.remove("hide");
  document.querySelector("#block-two").classList.remove("unselected");
  document.querySelector("#conditions-header").classList.add("hide");
  document.querySelector("#conditions-table").classList.add("hide");
}

function showConditions() {
  document.querySelector("#block-one").classList.remove("unselected");
  document.querySelector("#player-header").classList.add("hide");
  document.querySelector("#playersList").classList.add("hide");
  document.querySelector("#new-player").classList.add("hide");
  document.querySelector("#block-two").classList.add("unselected");
  document.querySelector("#conditions-header").classList.remove("hide");
  document.querySelector("#conditions-table").classList.remove("hide");
}

function search() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("conditions-search");
  filter = input.value.toUpperCase();
  table = document.getElementById("conditions-table");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function savePlayers() {
  try {
    var table = document.querySelector("#playersList");
    var rows = table.rows;
    var output = "";
    var i;

    for (i = 0; i < rows.length; i++) {
      if (output == "") {
        output = rows[i].outerHTML;
      } else {
        output += rows[i].outerHTML;
      }
    }

    output = output.replace(/\r\n|\r|\n/gm, "");

    var blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "players_list.txt");
  } catch (e) {
    console.log("Error saving player list");
  }
}

function uploadPlayers() {
  const reader = new FileReader();
  var output,
    file = document.querySelector("#file-upload").files[0];
  reader.readAsText(file);
  reader.onload = function () {
    document.querySelector("#playersList").innerHTML = reader.result;
  };
  reader.onerror = function () {
    console.log("fucked");
  };

  document.querySelector("#file-upload").value = null;
}

$("#start").on("click", () => {
  try {
    var table = document.querySelector("#playersList");
    var rows = table.rows;
    var button = document.querySelector("#start");
    var symbol = button.getElementsByTagName("i")[0];
    var i = 0;
    if (button.classList.contains("start")) {
      rows[0].classList.add("highlight");
      document.querySelector("#next").classList.remove("hide");
    } else if (button.classList.contains("stop")) {
      document.querySelector("#next").classList.add("hide");
      for (i; i < rows.length; i++) {
        if (rows[i].classList.contains("highlight")) {
          rows[i].classList.remove("highlight");
        }
      }
    }
    symbol.classList.toggle("fa-play");
    symbol.classList.toggle("fa-stop");
    button.classList.toggle("start");
    button.classList.toggle("stop");
  } catch (e) {
    console.log("Error starting or stopping initiative");
  }
});

$("#next").on("click", () => {
  try {
    var table = document.querySelector("#playersList");
    var rows = table.rows;
    var i = 0;
    for (i; i < rows.length; i++) {
      if (rows[i].classList.contains("highlight")) {
        position = i;
      }
    }
    if (position == "") {
      position = 0;
    }
    if (position < rows.length - 1) {
      rows[position].classList.remove("highlight");
      rows[position + 1].classList.add("highlight");
      position++;
    } else if (position == rows.length - 1) {
      rows[position].classList.remove("highlight");
      rows[0].classList.add("highlight");
      position = 0;
    }
  } catch (e) {
    console.log("Error running initiative");
  }
});