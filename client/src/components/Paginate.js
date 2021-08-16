import React from "react";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import "./Paginate.css";

const Paginate = ({ recipesPerPage, recipes, paginate, current }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(recipes / recipesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="paginate">
      <nav>
        <button
          onClick={() => {
            if (current >= 2) {
              paginate(current - 1);
            }
          }}
        >
          <ArrowBackIosIcon />
        </button>
        {pageNumbers &&
          pageNumbers.map((e) => (
            <button key={e} onClick={() => paginate(e)}>
              {e}
            </button>
          ))}
        <button
          onClick={() => {
            if (current < pageNumbers.length) paginate(current + 1);
          }}
        >
          <ArrowForwardIosIcon />
        </button>
      </nav>
    </div>
  );
};

export default Paginate;
