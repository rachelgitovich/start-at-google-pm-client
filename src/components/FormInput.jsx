import * as React from 'react';
import { FieldWrapper } from '@progress/kendo-react-form';
import { Input } from '@progress/kendo-react-inputs';
import {
  Label,
  Error,
  Hint,
  FloatingLabel,
} from '@progress/kendo-react-labels';
export const FormInput = (fieldRenderProps) => {
  const {
    validationMessage,
    touched,
    label,
    id,
    valid,
    disabled,
    hint,
    type,
    optional,
    ...others
  } = fieldRenderProps;
  const showValidationMessage = touched && validationMessage;
  const showHint = !showValidationMessage && hint;
  const hintId = showHint ? `${id}_hint` : '';
  const errorId = showValidationMessage ? `${id}_error` : '';
  return (
    <FieldWrapper>
      <div className={'k-form-field-wrap'}>
        <FloatingLabel
          editorId={id}
          editorValid={valid}
          editorDisabled={disabled}
          optional={optional}
          label={label}
        >
          <Input
            valid={valid}
            type={type}
            id={id}
            disabled={disabled}
            ariaDescribedBy={`${hintId} ${errorId}`}
            {...others}
          />
        </FloatingLabel>
        {showHint && <Hint id={hintId}>{hint}</Hint>}
        {showValidationMessage && (
          <Error id={errorId}>{validationMessage}</Error>
        )}
      </div>
    </FieldWrapper>
  );
};

