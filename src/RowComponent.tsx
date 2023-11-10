import React, { ChangeEvent, ReactNode } from "react";

export interface RowProps {
  idx: number;
  flag?: boolean;
  setValueInParent(value: number, idx: number, checkBoxFlag: boolean): void;
}

export default class RowComponent extends React.Component<RowProps>{
  flag: boolean;
  expense: number;

  constructor(props: RowProps) {
    super(props);
    this.flag = false;
    this.expense = 0;
  }

  render(): ReactNode {
    return <>
      <div key={this.props.idx} className="inputWrapper">
        <div className="inputOuterContainer">
          <div className="checkboxWrapper">
            <input type="checkbox" className="customCheckbox" onChange={this.onCheckBoxClicked.bind(this)} />
          </div>
        </div>
        <div className="inputOuterContainer">
          <input className="expenses" type="number" placeholder="Amout" onBlur={this.onChangeOfValue.bind(this)} />
        </div>
        <div className="inputOuterContainer">
          <input className="purpose" type="text" placeholder="Purpose of use" onBlur={this.onChangeOfValue.bind(this)} />
        </div>
      </div>
    </>;
  }

  onChangeOfValue(event: ChangeEvent<HTMLInputElement>): void {
    this.expense = setValueOfInput(event);
    setValuesInParent(this.props, this.expense, this.flag);
  }

  onCheckBoxClicked(event: ChangeEvent<HTMLInputElement>): void {
    this.flag = setFlagOfCheckbox(event);
    setValuesInParent(this.props, this.expense, this.flag);
  }

}

function setFlagOfCheckbox(event: ChangeEvent<HTMLInputElement>): boolean {
  return event.target.checked;
}

function setValueOfInput(event: ChangeEvent<HTMLInputElement>): number {
  let expense = parseInt(event.target.value);
  if (isNaN(expense)) { expense = 0; }
  return expense;
}

function setValuesInParent(props: RowProps, expense: number, flag: boolean): void {
  if (props.setValueInParent !== undefined) props.setValueInParent(props.idx, expense, flag);

}
