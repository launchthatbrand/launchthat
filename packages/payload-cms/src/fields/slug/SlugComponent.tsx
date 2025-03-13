"use client";

import "./index.scss";

import type { TextFieldClientProps } from "payload";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Button, FieldLabel, TextInput } from "@payloadcms/ui";

import { formatSlug } from "./formatSlug";

type SlugComponentProps = {
  fieldToUse: string;
  checkboxFieldPath: string;
} & TextFieldClientProps;

export const SlugComponent: React.FC<SlugComponentProps> = ({
  field,
  fieldToUse,
  checkboxFieldPath: checkboxFieldPathFromProps,
  path,
  readOnly: readOnlyFromProps,
}) => {
  // Simple state management as fallback for Payload hooks
  const [value, setValue] = useState("");
  const [checkboxValue, setCheckboxValue] = useState(true);
  const [targetFieldValue, setTargetFieldValue] = useState("");

  const { label } = field;

  const checkboxFieldPath = path?.includes(".")
    ? `${path}.${checkboxFieldPathFromProps}`
    : checkboxFieldPathFromProps;

  // Handle value changes - support both event objects and direct string values
  const handleChange = (e: ChangeEvent<HTMLInputElement> | string) => {
    if (typeof e === "string") {
      setValue(e);
    } else {
      setValue(e.target.value);
    }
  };

  useEffect(() => {
    if (checkboxValue) {
      if (targetFieldValue) {
        const formattedSlug = formatSlug(targetFieldValue);
        if (value !== formattedSlug) setValue(formattedSlug);
      } else {
        if (value !== "") setValue("");
      }
    }
  }, [targetFieldValue, checkboxValue, value]);

  const handleLock = useCallback(
    (e: React.MouseEvent<Element>) => {
      e.preventDefault();
      setCheckboxValue(!checkboxValue);
    },
    [checkboxValue],
  );

  const readOnly = readOnlyFromProps || checkboxValue;

  return (
    <div className="field-type slug-field-component">
      <div className="label-wrapper">
        <FieldLabel htmlFor={`field-${path}`} label={label} />

        <Button className="lock-button" buttonStyle="none" onClick={handleLock}>
          {checkboxValue ? "Unlock" : "Lock"}
        </Button>
      </div>

      <TextInput
        value={value}
        onChange={handleChange}
        path={path || field.name}
        readOnly={Boolean(readOnly)}
      />
    </div>
  );
};
