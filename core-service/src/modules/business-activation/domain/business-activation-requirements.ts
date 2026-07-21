import { BusinessType } from "../../business/domain/entities/business.entity";

export interface ActivationRequirements {
  needsService: boolean;
  needsResource: boolean;
  needsEmployee: boolean; 
}

export const ACTIVATION_REQUIREMENTS: Record<BusinessType, ActivationRequirements> = {
  RESTAURANT:    { needsService: true, needsResource: true,  needsEmployee: false },
  HOTEL:         { needsService: true, needsResource: true,  needsEmployee: false },
  SALON:         { needsService: true, needsResource: false, needsEmployee: true  },
  BARBERSHOP:    { needsService: true, needsResource: false, needsEmployee: true  },
  SPA:           { needsService: true, needsResource: false, needsEmployee: true  },
  BEAUTY_CLINIC: { needsService: true, needsResource: false, needsEmployee: true  },
  DENTIST:       { needsService: true, needsResource: false, needsEmployee: true  },
  CLINIC:        { needsService: true, needsResource: false, needsEmployee: true  },
  VETERINARY:    { needsService: true, needsResource: false, needsEmployee: true  },
  GYM:           { needsService: true, needsResource: false, needsEmployee: false },
  CAR_WASH:      { needsService: true, needsResource: false, needsEmployee: false },
  OTHER:         { needsService: true, needsResource: false, needsEmployee: false },
};
