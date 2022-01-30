import React, { useState } from "react";
import { Image, Card, Modal, Grid, Header, Message } from "semantic-ui-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "right",
    },
    title: {
      display: true,
      text: "People Reactions on Tweet",
    },
  },
};

const labels = ["Positive", "Neutral", "Negative"];

export const PeopleReactions = (props) => {
  const open = props.open;
  const reactions = props.reactions;
  const reactionsd = props.reactionsD;
  var replyCount = props.replyCount;
  var stance = props.stanceD;

  const data = {
    labels,
    datasets: [
      {
        label: "Reactions",
        data: reactionsd,
        borderColor: "rgb(30,144,255, 1)",
        backgroundColor: "rgba(30,144,255, 0.8)",
      },
    ],
  };

  return (
    <>
      <Modal open={open} onClose={() => props.openClose(false)}>
        <Modal.Header>Stance on Tweet</Modal.Header>
        <Modal.Content scrolling>
          <h4>{stance}</h4>
          <div>
            <Bar options={options} data={data} />
          </div>
        </Modal.Content>
        <Modal.Actions></Modal.Actions>
      </Modal>
    </>
  );
};
