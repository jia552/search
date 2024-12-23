const XLSX = require('xlsx');
const fs = require('fs');

// 读取 Excel 文件
const workbook = XLSX.readFile('1.xlsx');
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(worksheet);

// 处理数据
const stationMap = new Map();

data.forEach(row => {
  const course = row['课程'];
  const station = row['地铁站'];
  
  if (station && course) {
    if (!stationMap.has(station)) {
      stationMap.set(station, new Set());
    }
    stationMap.get(station).add(course);
  }
});

// 转换为最终格式
const courseData = {
  courses: Array.from(stationMap.entries()).map(([station, courses]) => ({
    station,
    courses: Array.from(courses)
  }))
};

// 输出 JSON
console.log(JSON.stringify(courseData, null, 2));

// 保存到文件（可选）
fs.writeFileSync('courseData.json', JSON.stringify(courseData, null, 2)); 