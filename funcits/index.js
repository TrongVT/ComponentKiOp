function convertDataArrayChart(data, seri, xA, xB, yA,colorsArr) {
    let listSeries = [];
    let listError = [];
  
    data.forEach(e => {
      let exist = false;
      listSeries.forEach(f => {
        if (f.seriesName === e[seri]) {
          exist = true;
          return;
        }
      });
      if (!exist) {
        listSeries.push({
          seriesName: e[seri],
          color: colorsArr[listSeries.length],
          data: [],
        });
      }
  
      let existE = false;
      listError.forEach(f => {
        if (f === e[xA]) {
          existE = true;
          return;
        }
      });
      if (!existE) {
        listError.push({ id: e[xA], name: e[xA] });
      }
    });
    listSeries.forEach(f => {
      data.forEach(e => {
        if (f.seriesName === e[seri]) {
          f.data.push({
            x0: e[xA],
            x: e[xB],
            y: e[yA],
          });
          f.data.sort((a, b) => {
            var nameA = a.x.toUpperCase();
            var nameB = b.x.toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
        }
      });
    });
  
    listSeries.forEach(f => {
      listError.forEach(k => {
        let ex2 = false;
        f.data.forEach(f2 => {
          if (f2.x0 === k.id) {
            ex2 = true;
          }
        });
        if (!ex2) {
          f.data.push({
            x: k.name,
            y: 0,
          });
  
          f.data.sort((a, b) => {
            var nameA = a.x.toUpperCase();
            var nameB = b.x.toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
        }
      });
    });
    return listSeries;
  }
  
  export {convertDataArrayChart}