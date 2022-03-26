/**
* @jest-environment jsdom
*/

import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderer from 'react-test-renderer';

import Login from '../src/components/Login';
