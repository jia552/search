import { read, utils } from 'xlsx';

interface CourseLocation {
  station: string;
  courses: string[];
}

// 从 JSON 文件加载数据
async function loadCourseData(): Promise<CourseLocation[]> {
  try {
    // 根据环境使用不同的路径
    const basePath = process.env.NODE_ENV === 'production' ? '/search' : '';
    const response = await fetch(`${basePath}/courseData.json`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.courses;
  } catch (error) {
    console.error('Failed to load course data:', error);
    // 返回一些默认数据，避免完全失败
    return [
      {
        station: "天香广场",
        courses: ["美甲", "化妆"]
      },
      {
        station: "五一广场",
        courses: ["纹绣"]
      }
    ];
  }
}

// 导出数据
export let courseData: CourseLocation[] = [];

// 立即加载数据
loadCourseData().then(data => {
  courseData = data;
}); 