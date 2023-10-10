export class DomainEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly eventType: string,
    public readonly eventData: any,
  ) {}

  toJSON() {
    return {
      aggregateId: this.aggregateId,
      eventType: this.eventType,
      eventData: this.eventData,
    };
  }
}
