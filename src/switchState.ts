export class SwitchState {
  constructor(private state: boolean = false) {}

  public get isOn() {
    return this.state
  }

  public setOnState(): void {
    this.state = true
  }

  public setOffState(): void {
    this.state = false
  }
}
