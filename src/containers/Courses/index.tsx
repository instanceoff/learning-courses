import React from 'react';
import Card from 'components/Card';
import Header from 'components/Header';
import { getCourses } from 'api/course';
import { DocumentData, QuerySnapshot } from 'firebase/firestore';

const Courses = () => {
  const courses = getCourses();

  return (
    <>
      <Header />
      <div className="flex w-screen">
        <div className="max-w-screen-lg w-fit flex col mx-auto my-5 flex-wrap">
          {courses.forEach(doc => {
            <Card title={doc.title} description={doc.description} />;
          })}
          {/* <Card title="Хуй" description="Большой и длинный" />
          <Card title="Хуй" description="Большой и длинный" />
          <Card title="Хуй" description="Большой и длинный" />
          <Card title="Хуй" description="Большой и длинный" />
          <Card title="Хуй" description="Большой и длинный" /> */}
        </div>
      </div>
    </>
  );
};

export default Courses;
