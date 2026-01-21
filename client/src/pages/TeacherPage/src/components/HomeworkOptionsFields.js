'use strict';

import { TextField, MenuItem, Grid, Box, IconButton, Typography, Divider } from '@mui/material';
import Iconify from './Iconify';
import { useFormContext } from 'react-hook-form';

function QuestionFields({ questionIndex, onRemove, canRemove }) {
  const { register, formState: { errors } } = useFormContext();
  const questionErrors = errors.questions?.[questionIndex];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Question {questionIndex + 1}
        </Typography>
        {canRemove && (
          <IconButton
            onClick={onRemove}
            color="error"
            size="small"
            aria-label={`Remove question ${questionIndex + 1}`}
          >
            <Iconify icon="eva:trash-2-outline" />
          </IconButton>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Question Text"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            {...register(`questions.${questionIndex}.questionText`, {
              required: 'Question text is required',
            })}
            error={!!questionErrors?.questionText}
            helperText={questionErrors?.questionText?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Option A"
            variant="outlined"
            fullWidth
            {...register(`questions.${questionIndex}.optionA`, {
              required: 'Option A is required',
            })}
            error={!!questionErrors?.optionA}
            helperText={questionErrors?.optionA?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Option B"
            variant="outlined"
            fullWidth
            {...register(`questions.${questionIndex}.optionB`, {
              required: 'Option B is required',
            })}
            error={!!questionErrors?.optionB}
            helperText={questionErrors?.optionB?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Option C"
            variant="outlined"
            fullWidth
            {...register(`questions.${questionIndex}.optionC`, {
              required: 'Option C is required',
            })}
            error={!!questionErrors?.optionC}
            helperText={questionErrors?.optionC?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Option D"
            variant="outlined"
            fullWidth
            {...register(`questions.${questionIndex}.optionD`, {
              required: 'Option D is required',
            })}
            error={!!questionErrors?.optionD}
            helperText={questionErrors?.optionD?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            select
            label="Correct Answer"
            fullWidth
            {...register(`questions.${questionIndex}.correct`, {
              required: 'Correct answer is required',
            })}
            error={!!questionErrors?.correct}
            helperText={questionErrors?.correct?.message}
          >
            <MenuItem value="A">A</MenuItem>
            <MenuItem value="B">B</MenuItem>
            <MenuItem value="C">C</MenuItem>
            <MenuItem value="D">D</MenuItem>
          </TextField>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function HomeworkOptionsFields({ questions, onAddQuestion, onRemoveQuestion }) {
  return (
    <Box>
      {questions.fields.map((field, index) => (
        <Box key={field.id} sx={{ mb: 3 }}>
          <QuestionFields
            questionIndex={index}
            onRemove={() => questions.removeQuestion(index)}
            canRemove={questions.fields.length > 1}
          />
          {index < questions.fields.length - 1 && (
            <Divider sx={{ mt: 3 }} />
          )}
        </Box>
      ))}

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Box
          onClick={questions.addQuestion}
          sx={{
            border: '1px dashed',
            borderColor: 'primary.main',
            borderRadius: 1,
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'primary.dark',
              bgcolor: 'action.hover',
            },
          }}
        >
          <Iconify icon="eva:plus-fill" sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="body2" sx={{ color: 'primary.main' }}>
            Add Another Question
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

