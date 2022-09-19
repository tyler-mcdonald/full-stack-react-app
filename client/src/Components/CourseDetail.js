import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { ActionsBar } from "./ActionsBar";
import { UserContext } from "../App";

const CourseDetail = () => {
  const [course, setCourse] = useState({});
  const [courseOwner, setCourseOwner] = useState({});
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const courseId = useParams().id;
  // const courseExists = Object.keys(course).length > 1; // Check if `course` is empty or contains only a `message` key

  useEffect(() => {
    const getCourseData = async () => {
      const response = await fetch(
        `http://localhost:5000/api/courses/${courseId}`
      );
      handleErrors(response.status);
      const data = await response.json();
      setCourse(data);
      setCourseOwner(data.User);
    };
    getCourseData();
  }, []);

  // might move to helpers dir
  const handleErrors = (status) => {
    if (status === 404) return navigate("/notfound");
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/courses/${courseId}`,
        {
          auth: { username: user.emailAddress, password: user.password },
        }
      );
      if (response.status === 204) return navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  // const handleDelete = async () => {
  //   axios
  //     .delete(`http://localhost:5000/api/courses/${courseId}`, {
  //       auth: {
  //         username: "joe@smith.com",
  //         password: "joepassword",
  //       },
  //     })
  //     .then((response) => {
  //       if (response.status === 204) {
  //         return navigate("/");
  //       }
  //     })
  //     .catch((err) => {
  //       // render pages based upon errors? --- ie server error?
  //       console.log(err);
  //     });
  // };

  return (
    <main>
      <ActionsBar
        courseId={courseId}
        handleDelete={handleDelete}
        courseOwner={courseOwner}
      />
      <div className="wrap">
        <h2>Course Detail</h2>
        <form>
          <div className="main--flex">
            <div>
              <h3 className="course--detail--title">Course</h3>
              <h4 className="course--name">{course.title}</h4>
              <p>{`Instructor: ${courseOwner.firstName} ${courseOwner.lastName}`}</p>
              <ReactMarkdown>{course.description}</ReactMarkdown>
            </div>
            <div>
              <h3 className="course--detail--title">Estimated Time</h3>
              <p>{course.estimatedTime}</p>
              <h3 className="course--detail--title">Materials Needed</h3>
              <ReactMarkdown>{course.materialsNeeded}</ReactMarkdown>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CourseDetail;
