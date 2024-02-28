import React, { useState, createContext, useContext } from 'react';


const OnboardingContext = createContext();
export const useOnboardingContext = () => useContext(OnboardingContext);

export default OnboardingContext;
