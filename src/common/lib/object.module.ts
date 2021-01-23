export const convertLinealObject = function (data: any): any {
  const ob = {};
  for (const i in data) {
    for (const j in data[i]) {
      ob[j] = data[i][j];
    }
  }
  return ob;
};
