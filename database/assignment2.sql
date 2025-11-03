-- Query 1 INSERT

INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES 
	('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');


-- Query 2 UPDATE
UPDATE account 
SET account_type = 'Admin' 
WHERE account_firstname = 'Tony';

-- Query 3 DELETE
DELETE FROM account 
WHERE account_firstname = 'Tony';

-- Query 4 REPLACE()
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 10;

-- Query 5 Inner Join
SELECT inv_make, inv_model, classification_name 
FROM inventory JOIN classification
	ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';


-- Query 6 Update File Path
UPDATE inventory
SET inv_image = REPLACE(inv_image,'images/', 'images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, 'images/', 'images/vehicles/');

