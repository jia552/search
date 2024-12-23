import { read, utils } from 'xlsx';

interface CourseLocation {
  station: string;
  courses: string[];
}

// 读取 Excel 文件
async function loadExcelData(): Promise<CourseLocation[]> {
  try {
    const response = await fetch('/1.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = read(arrayBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = utils.sheet_to_json(worksheet);

    // 处理数据
    const stationMap = new Map<string, Set<string>>();
    
    jsonData.forEach((row: any) => {
      const course = row['课程'];
      const station = row['地铁站'];
      
      if (station && course) {
        if (!stationMap.has(station)) {
          stationMap.set(station, new Set());
        }
        stationMap.get(station)?.add(course);
      }
    });

    return Array.from(stationMap.entries()).map(([station, courses]) => ({
      station,
      courses: Array.from(courses)
    }));
  } catch (error) {
    console.error('Failed to load Excel data:', error);
    return [];
  }
}

// 导出异步加载的数据
export let courseData: CourseLocation[] = [];

// 立即加载数据
loadExcelData().then(data => {
  courseData = data;
}); 