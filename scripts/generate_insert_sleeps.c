#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define INPUT_FILE "sleeps.txt"
#define OUTPUT_FILE "insert_sleeps.sql"

void generate_insert_item(char itemtype, char * insertstatement) {
	char *time = strtok(NULL, ",");
	char *value = strtok(NULL, ",");
	char *type = (itemtype == 'd') ? "diaper" : "feed";
	sprintf(insertstatement, "insert into baby_keyval (time, entry_type, entry_value) values (TIMESTAMP('%s'), '%s', '%s');\n", time, type, value);
}

void generate_insert_sleep(char * insertstatement) {
	char *start = strtok(NULL, ",");
	char *end = strtok(NULL, ",");

	char *startdate = strtok(start, " ");
	char *starttime = strtok(NULL, " ");

	char *enddate = strtok(end, " ");
	char *endtime = strtok(NULL, " ");

	char timestamp_end[100];
	if (enddate==NULL && endtime==NULL) {
		sprintf(timestamp_end, "NULL");
	}
	else if (endtime==NULL) {
		// endtime variable has null, but actually the date is missing, so use start date and use enddate for time (sorry!)
		sprintf(timestamp_end, "TIMESTAMP('%s %s')", startdate, enddate);
	}
	else {
		// assuming both there
		sprintf(timestamp_end, "TIMESTAMP('%s %s')", enddate, endtime);
	}

	sprintf(insertstatement, "insert into baby_sleep (start, end) values (TIMESTAMP('%s %s'), %s);\n", startdate, starttime, timestamp_end);
}

int main() {

	FILE *fp = fopen(INPUT_FILE, "r");
	if (fp == NULL) {
		printf("Failed to open the file");
		exit(1);
	}

	char insert_statements[1000][500];
	char buffer[100];
	int linecount = 0;
	while(fgets(buffer, 100, fp)) {
		int len = strlen(buffer);
		int i; 
		for(i = 0; i < len; i++) { if (buffer[i] == 10) buffer[i] = 0; }
		char *prefix = strtok(buffer, ",");
		char insertstatement[500];
		if (prefix[0] == 's') {
			generate_insert_sleep(insertstatement);
		}
		else if (prefix[0] == 'd' || prefix[0] == 'f') {
			generate_insert_item(prefix[i], insertstatement);
		}
		else {
			printf("Unknown prefix for line:%s\n", buffer);
		}
		printf("%s", insertstatement);
		strcpy(insert_statements[linecount], insertstatement);
		linecount++;
	}

	FILE *sql_file = fopen(OUTPUT_FILE, "w");
	int i;
	fputs("set time_zone = '-4:00';\n", sql_file);
	printf("linecount:%d\n", linecount);
	for(i = 0; i < linecount; i++) {
		fputs(insert_statements[i], sql_file);
	}
	fclose(sql_file);
	exit(0);

}
