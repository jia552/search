import React from 'react';
import { Card, Button, Tag, message, Space } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

interface Props {
  courses: Set<string>;
}

const CourseSummary: React.FC<Props> = ({ courses }) => {
  const courseList = Array.from(courses);

  const handleCopy = () => {
    const text = `附近有${courseList.join('、')}课程`;
    navigator.clipboard.writeText(text)
      .then(() => message.success('复制成功'))
      .catch(() => message.error('复制失败'));
  };

  return (
    <Card
      title="附近课程汇总"
      extra={
        <Button 
          icon={<CopyOutlined />} 
          type="primary"
          onClick={handleCopy}
        >
          复制课程表
        </Button>
      }
      style={{ 
        marginBottom: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <Space size={[8, 16]} wrap>
        {courseList.map((course, index) => (
          <Tag 
            key={index}
            color="blue"
            style={{ 
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '14px'
            }}
          >
            {course}
          </Tag>
        ))}
      </Space>
    </Card>
  );
};

export default CourseSummary; 