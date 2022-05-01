import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserClubs } from '../modules/api';

const ProjectClubList = function ProjectClubList({ userId, email }) {
  const userClubs = (() => {
    getUserClubs(email).then((res) => {
      if (res.status === 200) {
        console.log(res.jsonContent);
        return res.data;
      }
      return null;
    });
  });

  const hi = (() => (
    <div>
      d
    </div>
  ));

  return (
    <div>
      {userClubs() && hi()}
    </div>
  );
};

export default ProjectClubList;
