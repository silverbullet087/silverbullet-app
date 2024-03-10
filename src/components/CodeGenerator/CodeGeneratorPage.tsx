import {Button, Input, Typography} from 'antd';
import React, {useState} from 'react';
import ThemedTitle from "../../common/components/ThemedTitle";

const {Title, Text} = Typography;

const CodeGeneratorPage = () => {
	const [text, setText] = useState<string>('');

	const [sql, setSql] = useState<string>(
		`CREATE TABLE ALL_TYPES_EXAMPLE
(
    id INT PRIMARY KEY,
    short_number SMALLINT,
    tiny_number TINYINT,
    big_value BIGINT,
    longer_value LONG,
    floating_point FLOAT,
    double_value DOUBLE,
    real_value REAL,
    name VARCHAR(255),
    character CHAR(1),
    description TEXT,
	is_active BOOLEAN,
    created_date DATE,
    last_update_time TIME
);`
	);
	const [javaDtoCode, setJavaDtoCode] = useState<string>('');
	const [typescriptCode, setTypescriptCode] = useState<string>('');
	const [packageLastPart, setPackageLastPart] = useState<string>('sample');

	const upperCamelCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

	const toCamelCase = (str: string): string => {
		return str.toLowerCase()
			.split('_')
			.map((word, index) => index !== 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word)
			.join('');
	}

	const parseSqlToJava = (sql: string, packageLastPart: string): string => {
		const basePackage = "com.hbus.hbus.controller.dto";
		const fullPackage = `${basePackage}.${packageLastPart}`;


		const lines = sql.trim().split('\n');
		const className = lines[0].split(' ')[2].charAt(0).toUpperCase() + lines[0].split(' ')[2].slice(1);
		let fields: Array<[string, string]> = [];

		lines.slice(2, -1).forEach(line => {
			const parts = line.trim().replace(/,$/g, '').split(/\s+/);
			const fieldName = parts[0];
			const fieldType = parts[1].toUpperCase();

			console.log('parts: ', parts);
			console.log('fieldName: ', fieldName);
			console.log('fieldType: ', fieldType);

			let javaType = 'Object'; // Default type

			if (['INT', 'SMALLINT', 'TINYINT'].includes(fieldType)) {
				javaType = 'Integer';
			} else if (['LONG', 'BIGINT'].includes(fieldType)) {
				javaType = 'Long';
			} else if (['FLOAT', 'DOUBLE', 'REAL'].includes(fieldType)) {
				javaType = 'Double';
			} else if (fieldType.includes('VARCHAR') || fieldType.includes('CHAR') || fieldType.includes('TEXT')) {
				javaType = 'String';
			} else if (fieldType.includes('DATE') || fieldType.includes('TIME')) {
				javaType = 'LocalDate';
			} else if (fieldType.includes('BOOLEAN')) {
				javaType = 'Boolean';
			}

			console.log('javaType: ', javaType);

			fields.push([fieldName, javaType]);
		});

		let javaCode = `package ${fullPackage};\n\n`;
		javaCode += `import java.lang.Integer;\nimport java.lang.Long;\nimport java.lang.Double;\nimport java.lang.String;\nimport java.time.LocalDate;\n\n`;
		javaCode += `import lombok.Builder;\nimport lombok.Getter;\nimport lombok.Setter;\nimport lombok.NoArgsConstructor;\nimport lombok.AllArgsConstructor;\n\n`;

		javaCode += `public class ${upperCamelCase(toCamelCase(className))} {\n\n`;
		fields.forEach(([fieldName, javaType]) => {
			const camelFieldName = fieldName.split('_').map((word, i) => i > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word).join('');
			javaCode += `\tprivate ${javaType} ${camelFieldName};\n`;
		});
		javaCode += '\n}\n';
		return javaCode;
	}

	const parseSqlToTypescript = (sql: string): string => {
		const lines = sql.trim().split('\n');
		const tsTypeName = lines[0].split(' ')[2].charAt(0).toUpperCase() + lines[0].split(' ')[2].slice(1);
		let properties: Array<string> = [];

		lines.slice(2, -1).forEach(line => {
			const parts = line.trim().replace(/,$/g, '').split(/\s+/);
			const fieldName = parts[0];
			const fieldType = parts[1].toUpperCase();

			console.log('parts: ', parts);
			console.log('fieldName: ', fieldName);
			console.log('fieldType: ', fieldType);


			let tsType = 'any'; // Default TypeScript type

			if (['INT', 'SMALLINT', 'TINYINT', 'BIGINT', 'LONG'].includes(fieldType)) {
				tsType = 'number';
			} else if (['FLOAT', 'DOUBLE', 'REAL'].includes(fieldType)) {
				tsType = 'number';
			} else if (fieldType.includes('VARCHAR') || fieldType.includes('CHAR') || fieldType.includes('TEXT')) {
				tsType = 'string';
			} else if (fieldType.includes('DATE') || fieldType.includes('TIME')) {
				tsType = 'string'; // 'Date' 타입을 직접적으로 사용할 수도 있으나, 여기서는 문자열로 처리
			} else if (fieldType.includes('BOOLEAN')) {
				tsType = 'boolean';
			}

			const camelFieldName = fieldName.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
			properties.push(`    ${camelFieldName}: ${tsType};`);
		})

		return `interface ${upperCamelCase(toCamelCase(tsTypeName))} {\n${properties.join('\n')}\n}\n`;
	}


	const handleSqlChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setSql(event.target.value);
	};

	const handlePackageLastPartChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPackageLastPart(event.target.value);
	};

	const handlerCreateCode = () => {

		const javaClass = parseSqlToJava(sql, packageLastPart);
		setJavaDtoCode(javaClass);
		const typeCode = parseSqlToTypescript(sql);
		setTypescriptCode(typeCode);
		console.log('handlerCreateCode');
	}

	return (
		<div>
			<ThemedTitle title={'코드 생성 도구'}/>
			<Title level={2}>SQL: DB DDL 입력</Title>
			<Text>
				DB DDL 입력 후 생성 버튼 클릭시 DTO, Typescript 코드가 생성된다.
			</Text>

			<Input.TextArea
				rows={10}
				value={sql}
				onChange={handleSqlChange}
				placeholder="DB DDL 여기에 입력하세요."
				style={{marginBottom: '10px', marginTop: '20px'}}
			/>
			<Button onClick={handlerCreateCode}>코드 생성</Button>

			<Title level={2}>변환 결과</Title>
			<Text>
				java dto 코드가 여기에 생성됩니다.
			</Text>

			<Input.TextArea
				rows={30}
				value={javaDtoCode}
				placeholder="DB DDL 여기에 입력하세요."
				style={{marginBottom: '10px', marginTop: '20px'}}
			/>

			<Text>
				typescript type 코드가 여기에 생성됩니다.
			</Text>

			<Input.TextArea
				rows={30}
				value={typescriptCode}
				placeholder="DB DDL 여기에 입력하세요."
				style={{marginBottom: '10px', marginTop: '20px'}}
			/>
		</div>
	);
}

export default CodeGeneratorPage;
