import {transition, trigger, query, style, animate, group} from '@angular/animations';

const nextPageAnimation = [
  query(':enter, :leave',
    style({position: 'fixed', width: '100%'}),
    {optional: true}),
  group([
    query(':enter', [
      style({transform: 'translateX(100%)'}),
      animate('0.5s ease-in-out',
        style({transform: 'translateX(0%)'}))
    ], {optional: true}),
    query(':leave', [
      style({transform: 'translateX(0%)'}),
      animate('0.5s ease-in-out',
        style({transform: 'translateX(-100%)'}))
    ], {optional: true}),
  ])
];

const prevPageAnimation = [
  query(':enter, :leave',
    style({position: 'fixed', width: '100%'}),
    {optional: true}),
  group([
    query(':enter', [
      style({transform: 'translateX(-100%)'}),
      animate('0.5s ease-in-out',
        style({transform: 'translateX(0%)'}))
    ], {optional: true}),
    query(':leave', [
      style({transform: 'translateX(0%)'}),
      animate('0.5s ease-in-out',
        style({transform: 'translateX(100%)'}))
    ], {optional: true}),
  ])
];

export const slideInAnimation =
  trigger('routeAnimations', [
    transition('Home=> StepOne', nextPageAnimation),
    transition('StepOne=> StepTwo', nextPageAnimation),
    transition('StepTwo => StepThree', nextPageAnimation),
    transition('StepThree => Roof', nextPageAnimation),
    transition('Roof => Exterior', nextPageAnimation),
    transition('Exterior => StepFour', nextPageAnimation),
    transition('StepFour => StepFive', nextPageAnimation),
    transition('StepFive => StepSix', nextPageAnimation),
    transition('StepSix => StepSeven', nextPageAnimation),
    transition('StepSeven => StepEight', nextPageAnimation),
    transition('StepEight => StepNine', nextPageAnimation),
    transition('StepNine => StepOne', prevPageAnimation),
    transition('StepOne=> Home', prevPageAnimation),
    transition('StepTwo=> StepOne', prevPageAnimation),
    transition('StepThree=> StepTwo', prevPageAnimation),
    transition('Roof=> StepThree', prevPageAnimation),
    transition('Exterior=> Roof', prevPageAnimation),
    transition('StepFour=> Exterior', prevPageAnimation),
    transition('StepFive=> StepFour', prevPageAnimation),
    transition('StepSix=> StepFive', prevPageAnimation),
    transition('StepSeven=> StepSix', prevPageAnimation),
    transition('StepEight=> StepSeven', prevPageAnimation),
    transition('StepNine=> StepEight', prevPageAnimation),
    /**Newly added route animations**/
    transition('StepSix => PreparingPolicy', nextPageAnimation),
    transition('PreparingPolicy => StepSix', prevPageAnimation),
    transition('PolicyStartDate=> PreparingPolicy', prevPageAnimation),
    transition('PreparingPolicy => PolicyStartDate', nextPageAnimation),
    transition('PolicyStartDate => PolicyHaveMortgage', nextPageAnimation),
    transition('PolicyHaveMortgage=> PolicyStartDate', prevPageAnimation),
    transition('PolicyHaveMortgage=> PolicyMortgageInfo', nextPageAnimation),
    transition('PolicyMortgageInfo=> PolicyHaveMortgage', prevPageAnimation),
    transition('PolicyMortgageInfo=> PolicyOlarkChat', nextPageAnimation),
    transition('PolicyOlarkChat=> PolicyMortgageInfo', prevPageAnimation),
    transition('StepOne=> HavenInputs', nextPageAnimation),
    transition('HavenInputs => HavenResult', nextPageAnimation),
    transition('HavenInputs=> StepOne', prevPageAnimation),
    transition('HavenResult=> HavenInputs', prevPageAnimation),
  ]);
/*comment*/
