import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { agentOrAdminGuard } from './agent-or-admin.guard';

describe('agentOrAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => agentOrAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
