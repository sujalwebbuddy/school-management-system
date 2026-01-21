import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Box } from "@mui/system";
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "#1A2027",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const BpIcon = styled("span")(({ theme }) => ({
  borderRadius: "50%",
  width: 16,
  height: 16,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 0 0 1px rgb(16 22 26 / 40%)"
      : "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
  backgroundColor: theme.palette.mode === "dark" ? "#394b59" : "#f5f8fa",
  backgroundImage:
    theme.palette.mode === "dark"
      ? "linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))"
      : "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  "input:hover ~ &": {
    backgroundColor: theme.palette.mode === "dark" ? "#30404d" : "#ebf1f5",
  },
  "input:disabled ~ &": {
    boxShadow: "none",
    background:
      theme.palette.mode === "dark"
        ? "rgba(57,75,89,.5)"
        : "rgba(206,217,224,.5)",
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: "#137cbd",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
  "&:before": {
    display: "block",
    width: 16,
    height: 16,
    backgroundImage: "radial-gradient(#fff,#fff 28%,transparent 32%)",
    content: '""',
  },
  "input:hover ~ &": {
    backgroundColor: "#106ba3",
  },
});

// Inspired by blueprintjs
function BpRadio(props) {
  return (
    <Radio
      sx={{
        "&:hover": {
          bgcolor: "transparent",
        },
      }}
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      {...props}
    />
  );
}
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function normalizeHomeworkQuestions(homework) {
  if (!homework) {
    return [];
  }

  if (homework.questions && Array.isArray(homework.questions)) {
    return homework.questions;
  }

  if (homework.optionA && homework.optionB && homework.optionC && homework.optionD) {
    return [
      {
        questionText: homework.description || "",
        optionA: homework.optionA,
        optionB: homework.optionB,
        optionC: homework.optionC,
        optionD: homework.optionD,
        correct: homework.correct,
      },
    ];
  }

  return [];
}

export default function HomeworkDetails() {
  const location = useLocation();
  const homeid = location.state;
  const homeworkList = useSelector((state) => {
    return state?.student?.homeworks?.homeworkList;
  });
  const myhomework = homeworkList?.find((el) => el._id === homeid);

  const questions = useMemo(() => normalizeHomeworkQuestions(myhomework), [myhomework]);

  const [answers, setAnswers] = useState({});
  const [questionResults, setQuestionResults] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState({ severity: "success", message: "" });

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };

  const handleCheckAnswer = (questionIndex) => {
    const question = questions[questionIndex];
    const answer = answers[questionIndex];
    if (!answer) {
      setSnackbarMessage({
        severity: "warning",
        message: "Please select an answer first",
      });
      setOpenSnackbar(true);
      return;
    }

    const isCorrect = answer === question.correct;
    setQuestionResults((prev) => ({
      ...prev,
      [questionIndex]: isCorrect,
    }));

    setSnackbarMessage({
      severity: isCorrect ? "success" : "error",
      message: isCorrect ? "Good Job! Your answer is correct" : "Incorrect! Try again please",
    });
    setOpenSnackbar(true);
  };

  const handleCheckAllAnswers = () => {
    let allAnswered = true;
    for (let i = 0; i < questions.length; i += 1) {
      if (!answers[i]) {
        allAnswered = false;
        break;
      }
    }

    if (!allAnswered) {
      setSnackbarMessage({
        severity: "warning",
        message: "Please answer all questions before checking",
      });
      setOpenSnackbar(true);
      return;
    }

    const results = {};
    let correctCount = 0;
    for (let i = 0; i < questions.length; i += 1) {
      const isCorrect = answers[i] === questions[i].correct;
      results[i] = isCorrect;
      if (isCorrect) {
        correctCount += 1;
      }
    }

    setQuestionResults(results);
    setSnackbarMessage({
      severity: correctCount === questions.length ? "success" : "info",
      message: `You got ${correctCount} out of ${questions.length} questions correct`,
    });
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
  if (!myhomework || questions.length === 0) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 400 }}>
        <Typography variant="h6" color="text.secondary">
          Homework not found or has no questions
        </Typography>
      </Stack>
    );
  }

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4" gutterBottom style={{ color: "#ff808b" }}>
          Homework Details
        </Typography>
      </Stack>

      {questions.map((question, questionIndex) => (
        <Card key={questionIndex} sx={{ mb: 3 }}>
          <CardHeader
            title={`Question ${questionIndex + 1}`}
            titleTypographyProps={{ variant: "h5" }}
          />
          <Divider />
          <CardContent>
            <Typography variant="h6" style={{ color: "#6B5B95", mb: 2 }}>
              Question:
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {question.questionText}
            </Typography>
            <Typography variant="h6" style={{ color: "#6B5B95", mb: 2 }}>
              Options:
            </Typography>
            <RadioGroup
              name={`question-${questionIndex}`}
              value={answers[questionIndex] || ""}
              onChange={(e) => handleAnswerChange(questionIndex, e.target.value)}
            >
              <Box sx={{ width: "100%" }}>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item xs={12} sm={6}>
                    <Item>
                      <FormControlLabel
                        value="A"
                        control={<BpRadio />}
                        label={`Option A: ${question.optionA}`}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Item>
                      <FormControlLabel
                        value="B"
                        control={<BpRadio />}
                        label={`Option B: ${question.optionB}`}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Item>
                      <FormControlLabel
                        value="C"
                        control={<BpRadio />}
                        label={`Option C: ${question.optionC}`}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Item>
                      <FormControlLabel
                        value="D"
                        control={<BpRadio />}
                        label={`Option D: ${question.optionD}`}
                      />
                    </Item>
                  </Grid>
                </Grid>
              </Box>
            </RadioGroup>
            {questionResults[questionIndex] !== undefined && (
              <Box sx={{ mt: 2 }}>
                <Alert
                  severity={questionResults[questionIndex] ? "success" : "error"}
                  sx={{ width: "100%" }}
                >
                  {questionResults[questionIndex]
                    ? "Correct!"
                    : "Incorrect. Try again!"}
                </Alert>
              </Box>
            )}
          </CardContent>
          <Box m={1} display="flex" justifyContent="center" alignItems="center">
            <Button
              variant="outlined"
              onClick={() => handleCheckAnswer(questionIndex)}
            >
              Check This Answer
            </Button>
          </Box>
        </Card>
      ))}

      {questions.length > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 3 }}>
          <Button variant="contained" onClick={handleCheckAllAnswers}>
            Check All Answers
          </Button>
        </Box>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarMessage.severity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage.message}
        </Alert>
      </Snackbar>
    </>
  );
}
