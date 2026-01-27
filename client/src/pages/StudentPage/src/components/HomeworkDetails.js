import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  Typography,
  Divider,
  Container,
} from "@mui/material";
import {
  Quiz as QuizIcon,
  HelpOutline as HelpIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  SearchOff as SearchOffIcon,
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import Label from "../components/Label";
import MuiAlert from "@mui/material/Alert";
import { Box } from "@mui/system";
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Page from "../components/Page";

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

  if (
    homework.optionA &&
    homework.optionB &&
    homework.optionC &&
    homework.optionD
  ) {
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
  const navigate = useNavigate();
  const { id } = useParams();
  const homeid = location.state || id;
  const homeworkList = useSelector((state) => {
    return state?.student?.homeworks?.homeworkList;
  });
  const myhomework = homeworkList?.find((el) => el._id === homeid);

  const questions = useMemo(
    () => normalizeHomeworkQuestions(myhomework),
    [myhomework],
  );

  const [answers, setAnswers] = useState({});
  const [questionResults, setQuestionResults] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState({
    severity: "success",
    message: "",
  });

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
      message: isCorrect
        ? "Good Job! Your answer is correct"
        : "Incorrect! Try again please",
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
      <Page title="Homework Details">
        <Container maxWidth="md">
          <Card
            sx={{
              mt: 8,
              p: 8,
              textAlign: "center",
              borderRadius: 3,
              boxShadow: (theme) => theme.customShadows?.z24,
            }}
          >
            <Box
              sx={{
                mb: 3,
                mx: "auto",
                width: 120,
                height: 120,
                bgcolor: "background.neutral",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SearchOffIcon sx={{ fontSize: 64, color: "text.disabled" }} />
            </Box>
            <Typography variant="h4" gutterBottom fontWeight={700}>
              Homework Not Found
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 400, mx: "auto" }}
            >
              The requested homework could not be found. This might be due to an
              expired link or the homework has been removed.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ px: 4, py: 1.5, borderRadius: 2 }}
            >
              Go Back to List
            </Button>
          </Card>
        </Container>
      </Page>
    );
  }

  return (
    <Page title="Homework Details">
      <Container maxWidth="lg">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Homework Details
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <AssignmentIcon sx={{ fontSize: 16, color: "primary.main" }} />
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={600}
              >
                {myhomework.name}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        {questions.map((question, questionIndex) => (
          <Card
            key={questionIndex}
            sx={{
              mb: 5,
              borderRadius: 2,
              boxShadow: (theme) => theme.customShadows?.z16,
              overflow: "hidden",
            }}
          >
            <CardHeader
              title={
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: "primary.lighter",
                        color: "primary.main",
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <QuizIcon />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Question {questionIndex + 1}
                    </Typography>
                  </Stack>
                  {questionResults[questionIndex] !== undefined && (
                    <Label
                      color={
                        questionResults[questionIndex] ? "success" : "error"
                      }
                      variant="soft"
                      sx={{
                        px: 2,
                        py: 2,
                        textTransform: "uppercase",
                        fontWeight: 700,
                      }}
                    >
                      {questionResults[questionIndex] ? "Correct" : "Incorrect"}
                    </Label>
                  )}
                </Stack>
              }
              sx={{
                bgcolor: "background.neutral",
                px: 3,
                py: 2,
              }}
            />
            <Divider />
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                <HelpIcon sx={{ color: "text.disabled", mt: 0.5 }} />
                <Typography
                  variant="h5"
                  sx={{
                    color: "text.primary",
                    fontWeight: 600,
                    lineHeight: 1.4,
                  }}
                >
                  {question.questionText}
                </Typography>
              </Stack>

              <RadioGroup
                name={`question-${questionIndex}`}
                value={answers[questionIndex] || ""}
                onChange={(e) =>
                  handleAnswerChange(questionIndex, e.target.value)
                }
              >
                <Grid container spacing={2.5}>
                  {["A", "B", "C", "D"].map((option) => (
                    <Grid item xs={12} sm={6} key={option}>
                      <Paper
                        onClick={() =>
                          handleAnswerChange(questionIndex, option)
                        }
                        elevation={0}
                        sx={{
                          p: 2.5,
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          borderRadius: 2,
                          border: "2px solid",
                          borderColor:
                            answers[questionIndex] === option
                              ? "primary.main"
                              : "divider",
                          bgcolor:
                            answers[questionIndex] === option
                              ? "primary.lighter"
                              : "background.paper",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor:
                              answers[questionIndex] === option
                                ? "primary.lighter"
                                : "action.hover",
                            borderColor:
                              answers[questionIndex] === option
                                ? "primary.main"
                                : "text.disabled",
                          },
                        }}
                      >
                        <Radio
                          value={option}
                          sx={{
                            mr: 2,
                            "&.Mui-checked": {
                              color: "primary.main",
                            },
                          }}
                        />
                        <Typography
                          variant="subtitle1"
                          sx={{
                            flexGrow: 1,
                            fontWeight:
                              answers[questionIndex] === option ? 700 : 500,
                            color:
                              answers[questionIndex] === option
                                ? "primary.dark"
                                : "text.primary",
                          }}
                        >
                          {question[`option${option}`]}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>

              {questionResults[questionIndex] !== undefined &&
                !questionResults[questionIndex] && (
                  <Box
                    sx={{
                      mt: 4,
                      p: 2,
                      bgcolor: "error.lighter",
                      color: "error.darker",
                      borderRadius: 1.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      border: "1px solid",
                      borderColor: "error.light",
                    }}
                  >
                    <ErrorIcon sx={{ fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Incorrect answer. Please review the question and try a
                      different option.
                    </Typography>
                  </Box>
                )}

              {questionResults[questionIndex] !== undefined &&
                questionResults[questionIndex] && (
                  <Box
                    sx={{
                      mt: 4,
                      p: 2,
                      bgcolor: "success.lighter",
                      color: "success.darker",
                      borderRadius: 1.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      border: "1px solid",
                      borderColor: "success.light",
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Outstanding! You've correctly identified the right answer.
                    </Typography>
                  </Box>
                )}
            </CardContent>
            <Divider />
            <Box
              sx={{
                p: 2.5,
                display: "flex",
                justifyContent: "flex-end",
                bgcolor: "background.neutral",
              }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<CheckCircleIcon />}
                onClick={() => handleCheckAnswer(questionIndex)}
                sx={{
                  px: 4,
                  borderRadius: 1.5,
                  boxShadow: (theme) => theme.customShadows?.primary,
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Check Answer
              </Button>
            </Box>
          </Card>
        ))}

        {questions.length > 1 && (
          <Stack alignItems="center" sx={{ mt: 6, mb: 10 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleCheckAllAnswers}
              sx={{
                px: 8,
                py: 2,
                borderRadius: 2,
                fontSize: "1.1rem",
                fontWeight: 800,
                textTransform: "none",
                boxShadow: (theme) => theme.customShadows?.z24,
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: (theme) => theme.customShadows?.z24,
                },
              }}
            >
              Submit All Answers
            </Button>
          </Stack>
        )}

        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarMessage.severity}
            sx={{ width: "100%", borderRadius: 2 }}
          >
            {snackbarMessage.message}
          </Alert>
        </Snackbar>
      </Container>
    </Page>
  );
}
