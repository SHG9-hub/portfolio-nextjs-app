import '@testing-library/jest-dom'

jest.mock('notistack', () => ({
    useSnackbar: () => ({ enqueueSnackbar: jest.fn() }),
    enqueueSnackbar: jest.fn(),
}));