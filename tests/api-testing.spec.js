const { test, expect } = require('@playwright/test');
const { request } = require('node:http');

test.describe('API Testing - Request Context', () => {

    test('GET request returns a valid post', async ({ request }) => {
        const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.id).toBe(1);
        expect(body.title).toBeTruthy();
    });

    test('GET request for non-existent post returns 404', async ({ request }) => {
        const response = await request.get('https://jsonplaceholder.typicode.com/posts/99999');

        expect(response.status()).toBe(404);
    });

    test('POST request creates a new record', async ({ request }) => {
        const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
            data: {
                title: 'RPT-001 Filing Query',
                body: 'Regulatory reporting automation practice post',
                userId: 1
            }
        });

        expect(response.status()).toBe(201);

        const body = await response.json();
        expect(body.title).toBe('RPT-001 Filing Query');
        expect(body.id).toBeTruthy();
    });

    test('POST request with missing or invalid field and check return code', async ({ request }) => {

        const response = await request.post('https://jsonplaceholder.typicode.com/users', {
            data: {
                id: 11,
                name: 'Invalid User',
                username: 'InvalidUser',
                emailid: 'abc@gmail.com'

            }
        });

        console.log('Status: ', response.status());
        console.log('Body: ', await response.text());

        expect(response.status()).toBe(201);

        const body = await response.json();
        expect(body.emailid).toBe('abc@gmail.com'); // echoed back, not validated
        
    });


    test('PUT request updates an existing record', async ({ request }) => {
        const response = await request.put('https://jsonplaceholder.typicode.com/posts/1', {
            data: {
                id: 1,
                title: 'Updated Filing Status',
                body: 'Status updated after regulator review',
                userId: 1
            }
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.title).toBe('Updated Filing Status');
    });

    test('DELETE request removes a record', async ({ request }) => {
        const response = await request.delete('https://jsonplaceholder.typicode.com/posts/1');

        expect(response.status()).toBe(200);
    });

    test('GET user 1 data and check nested fields', async ({ request }) => {
        const response = await request.get('https://jsonplaceholder.typicode.com/users/1');

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.id).toBe(1);
        expect(body.address.city).toBe('Gwenborough');
        expect(body.company.name).toBe('Romaguera-Crona');

    });

    test('debug practice - log full response when checking status', async ({ request }) => {
        const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

        // Log everything BEFORE asserting, so it's visible even if the test fails
        console.log('Status:', response.status());
        console.log('Headers:', response.headers());
        console.log('Body:', await response.text());

        expect(response.status()).toBe(200);
    });

});