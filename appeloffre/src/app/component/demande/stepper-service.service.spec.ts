import { TestBed } from '@angular/core/testing';

import { StepperServiceService } from './stepper-service.service';

describe('StepperServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StepperServiceService = TestBed.get(StepperServiceService);
    expect(service).toBeTruthy();
  });
});
