import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

function CodeforcesGraph() {
  const [data, setdata] = useState({});
  const [mxRating, setmxRating] = useState(0);

  const options = {
    legend: {
      display: false,
    },
    elements: {
      points: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  useEffect(() => {
    const fetchdata = async () => {
      fetch("https://codeforces.com/api/user.rating?handle=Paladin09")
        .then((res) => res.json())
        .then((res) => {
          if (res.status === "OK" && res.result.length > 1) {
            var newarr = [];
            var mx = 0;
            res.result.forEach((data) => {
              newarr.push(data.newRating);
              if (data.newRating && data.newRating >= mx) {
                mx = data.newRating;
              }
            });
            setmxRating(mx);
            var newlabels = [...Array(res.result.length).keys()];
            setdata({
              labels: newlabels,
              datasets: [
                {
                  label: "Ratings",
                  data: newarr,
                  backgroundColor: "white",
                  borderColor: "",
                  fill: false,
                },
              ],
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchdata();
    return () => {
      //
    };
  }, []);

  return (
    <>
      <br />
      <p style={{color: "black" }}>
        Codeforces Ratings:{" "}
        <p style={{ color: "black", display: "inline" }}>{mxRating}</p>{" "}
        <i>
          <small>(max-rating)</small>
        </i>
      </p>
      <div>
        <Line data={data} options={options} />
      </div>
    </>
  );
}

export default CodeforcesGraph;
