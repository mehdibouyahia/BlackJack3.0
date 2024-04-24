import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  CheckboxInputWrapper,
  CheckboxLabel,
  InputWrapper,
  CheckboxInput,
  ErrorMsg,
  Input,
  Label,
  Form,
} from "./Manager.styled";
import { SocketEmit, SocketOn, Socket } from "../../assets/constants";
import { StyledBtn } from "../App/App.styled";
import { game } from "../../game-elements/game";

export const PlayerInfos = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm();
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();

  const onJoinTable = useCallback((name, balance, id) => {
    id
      ? game.emit[SocketEmit.JoinTable](id, name, balance)
      : game.emit[SocketEmit.CreateTable](name, balance);
  }, []);

  const onSubmit = useCallback(
    (data) => {
      setDisabled(true);
      const { name, balance, joinExistingTable, tableId } = data;
      if (joinExistingTable && !tableId) {
        return;
      }
      onJoinTable(name, balance, joinExistingTable ? tableId : undefined);
    },
    [onJoinTable]
  );

  useEffect(() => {
    const handleTableCreated = (table, player) => {
      game.onTableCreated(JSON.parse(table), JSON.parse(player));
      if (game.table && game.player) {
        navigate(`/table?id=${game.table.id}`);
      }
      game.modalUpdate(true);
    };

    const handleError = () => {
      setDisabled(false);
      setError("tableId", { message: "Invalid table ID" });
      const tableIdInput = document.querySelector('input[name="tableId"]');
      if (tableIdInput) {
        tableIdInput.value = "";
      }
    };

    Socket.on(SocketOn.TableCreated, handleTableCreated);
    Socket.on(SocketOn.Error, handleError);

    return () => {
      Socket.off(SocketOn.TableCreated, handleTableCreated);
      Socket.off(SocketOn.Error, handleError);
    };
  }, [navigate, setError]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <InputWrapper>
        {errors.name && <ErrorMsg>{errors.name.message}</ErrorMsg>}
        <Input
          autoComplete="off"
          className={`${watch("name") ? "filled" : ""}`}
          type="text"
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 3,
              message: "Name should be at least 3 characters",
            },
          })}
        />
        <Label>Name:</Label>
      </InputWrapper>
      <InputWrapper>
        {errors.balance && <ErrorMsg>{errors.balance.message}</ErrorMsg>}
        <Input
          autoComplete="off"
          className={`${watch("balance") ? "filled" : ""}`}
          // type="number"
          {...register("balance", {
            required: "Balance is required",
            min: {
              value: 100,
              message: "Minimum balance should be 100",
            },
            pattern: {
              value: /^\d+$/,
              message: "Invalid balance format. Enter a number",
            },
          })}
        />
        <Label>Balance:</Label>
      </InputWrapper>
      <CheckboxInputWrapper>
        <CheckboxInput
          id="checkbox"
          type="checkbox"
          className="checkbox-input"
          {...register("joinExistingTable")}
        />
        <label className="fake-check" htmlFor="checkbox"></label>

        <CheckboxLabel>Join table</CheckboxLabel>
      </CheckboxInputWrapper>
      {watch("joinExistingTable") && (
        <InputWrapper>
          {errors.tableId && <ErrorMsg>{errors.tableId.message}</ErrorMsg>}
          <Input
            autoComplete="off"
            className={`${watch("tableId") ? "filled" : ""}`}
            type="text"
            {...register("tableId", {
              required: "Table ID is required",
            })}
          />
          <Label>Table id:</Label>
        </InputWrapper>
      )}
      <StyledBtn
        type="submit"
        className="button buttonBlue"
        disabled={disabled}
      >
        {watch("joinExistingTable") ? "Join table" : "Create a new table"}
      </StyledBtn>
    </Form>
  );
};
